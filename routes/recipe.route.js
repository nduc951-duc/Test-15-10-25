import express from 'express';
import * as recipeModel from '../models/recipe.model.js';
import * as cuisineModel from '../models/cuisine.model.js';

const router = express.Router();

// Lấy tất cả chuyên mục
router.get('/', async (req, res) => {

        const list = await recipeModel.findAllWithCuisine();
        res.render('vwRecipes/list', {
            recipes: list
        });

});

router.get('/detail', async function (req, res) {
    const id = req.query.id;
    const recipe = await recipeModel.findById(id);
    if (!recipe) {
      return res.redirect('/recipes');
    }
    res.render('vwRecipes/detail', {
      recipe: recipe
    });
  });

  router.get('/create', async function (req, res) {
    const cuisines = await cuisineModel.findAll();
    res.render('vwRecipes/create', {
      cuisines: cuisines
    });
  });

  router.post('/create', async function (req, res) {
    const recipe =
    {
      title: req.body.title,
      author: req.body.author,
      cover_image_url: req.body.cover_image_url,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      difficulty: req.body.difficulty,
      cuisine_id: req.body.cuisine_id
    }
    await recipeModel.add(recipe);
    res.redirect('/recipes');
  });

export default router;
