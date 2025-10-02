import express from 'express';
import * as categoryModel from '../models/category.model.js';


const router = express.Router();

router.get('/', async function (req, res) {
    const categories = await categoryModel.findAll();
    res.render('vwCategories/list', {
        req: req,
        categories: categories
    });
});
    

router.get('/add', function (req, res) {
    res.render('vwAdminCategory/add');
});

router.post('/add', async function (req, res) {
    const category = {
        catname: req.body.catName
    };
    const ret = await categoryModel.add(category);
    console.log(ret);
    res.render('vwAdminCategory/add');  
});

router.get('/edit', async function (req, res) {
    const id = +req.query.id || 0;
    const category = await categoryModel.findById(id);
    res.render('vwAdminCategory/edit',{
        category:category
    });
});

router.post('/edit', async function (req, res) {
    const id = req.body.catid;
    const newName = req.body.catname;
    await categoryModel.patch(id, { catname: newName });
    res.redirect('/admin/categories');
  });

  router.post('/patch', async function (req, res) {
    const id = req.body.catid;
    const category = {
        catname: req.body.catname
    }
    await categoryModel.patch(id, category);
    res.redirect('/admin/categories');
  });
  

router.post('/delete', async function (req, res) {
    const id =req.body.catid;
    await categoryModel.del(id);
    res.redirect('/admin/categories');// xoá xong thì về trang danh sách
});

export default router;