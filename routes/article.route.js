import express from 'express';
import * as articleModel from '../models/article.model.js';
import * as categoryModel from '../models/category.model.js';

const router = express.Router();

// Lấy tất cả chuyên mục
router.get('/', async (req, res) => {

        const list = await articleModel.findAllWithCategories();
        res.render('vwArticles/list', {
            articles: list
        });

});

router.get('/detail', async function (req, res) {
    const id = req.query.id;
    const article = await articleModel.findById(id);
    if (!article) {
      return res.redirect('/articles');
    }
    res.render('vwArticles/detail', {
      article: article
    });
  });

  router.get('/create', async function (req, res) {
    const categories = await categoryModel.findAll();
    res.render('vwArticles/create', {
      categories: categories
    });
  });

  router.post('/create', async function (req, res) {
    const article =
    {
        title: req.body.title,
        author: req.body.author,
        abstract: req.body.abstract,
        content: req.body.content,
        category_id: req.body.category_id,
        is_premium: req.body.is_premium === 'on'
    }
    await articleModel.add(article);
    res.redirect('/articles');
  });

export default router;
