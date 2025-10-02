import express from 'express';
import * as userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { restrict } from '../middlewares/auth.mdw.js';

const router = express.Router();

router.get('/signup', function (req, res) {
    res.render('vwAccount/signup');
});

router.get('/signin', function (req, res) {
    res.render('vwAccount/signin', {
        error: null
    });
});

router.post('/signin', async function (req, res) {
    const user = await userModel.findByUsername(req.body.username);
  
    if (!user) {
      return res.render('vwAccount/signin', {  // ⬅️ thêm return
        error: true
      });
    }
  
    const password_match = bcrypt.compareSync(req.body.password, user.password);
    if (!password_match) {
      return res.render('vwAccount/signin', { error: true });
    }
  
    req.session.isAuthenticated = true;
    req.session.authUser = user;
    const retUrl = req.session.retUrl || '/';
    delete req.session.retUrl;
    res.redirect(retUrl);
  });

router.post('/signup', async function (req, res) {
    const hash_password = bcrypt.hashSync(req.body.password, 10);
    const user = {
        username: req.body.username,
        password: hash_password,
        name: req.body.name,
        email: req.body.email,
        dob: req.body.dob,
        permission: 0
    }
    await userModel.add(user);
    res.render('vwAccount/signup');
});

router.get('/is-available', async function (req, res) {
    const u = req.query.u;
    const user = await userModel.findByUsername(u);
    if (!user) {
        return res.json(true);
    }
    return res.json(false);
});

router.post('/signout', function (req, res) {
    req.session.isAuthenticated = false;
    req.session.authUser = null;
    res.redirect('/');
  });
  
router.get('/profile',restrict, function (req, res) {
    res.render('vwAccount/profile', {
        user: req.session.authUser
    });
});

router.post('/profile', restrict, async function (req, res) {
    const id = req.body.id;
    const user = {
        name: req.body.name,
        email: req.body.email,
    }

    await userModel.patch(id, user);

    req.session.authUser.name = user.name;
    req.session.authUser.email = user.email;

    res.render('vwAccount/profile', {
        user: req.session.authUser
    });
});

router.get('/change-password', restrict, function (req, res) {
    res.render('vwAccount/change-pwd', {
        req: req,
        user: req.session.authUser,
    });
});

router.post('/change-password', restrict, async function (req, res) {
    const id = req.body.id;
    const curpwd = req.body.curPwd; // fixed case
    const newpwd = req.body.newPwd; // fixed case

    // compare current password
    const ret = bcrypt.compareSync(curpwd, req.session.authUser.password);
    if (!ret) {
        return res.render('vwAccount/change-pwd', {
            user: req.session.authUser,
            error: true
        });
    }

    // hash new password
    const hash_password = bcrypt.hashSync(newpwd, 10);
    await userModel.patch(id, { password: hash_password });

    // update session
    req.session.authUser.password = hash_password;

    res.redirect('/account/profile');
});


export default router;