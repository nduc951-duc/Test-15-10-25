import express from 'express';
import * as userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';

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
    res.redirect('/');
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

function restrict(req, res, next) {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/account/signin');
    }
  }

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

export default router;