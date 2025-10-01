import express from 'express';
import * as productModel from '../models/product.model.js';
import * as categoryModel from '../models/category.model.js';
import { publicDecrypt } from 'crypto';

const router = express.Router();

router.get('/byCat', async function (req, res) {
    const id = req.query.id || 0;

    let catname='?';
    const category = await categoryModel.findById(id);
    if (category)
    {
        catname = category.catname;
    }

    const limit = 4;
    //const offset = req.query.offset || 0;
    const page = req.query.page || 1;              //<----- req.query.page lấy từ URL
    const offset = (page - 1) * limit;

    const total = await productModel.countByCat(id);
    const totalPages = Math.ceil(total.amount / limit);   //<--- Ceil làm tròn lên, Floor làm tròn xuống, Round làm tròn bình thường
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push({
            value: i,
            catid: id,
            isCurrent: i === parseInt(page),
        });
    }

    const list = await productModel.findPageByCat(id, offset, limit);
    res.render('vwProducts/byCat',
        {
            req: req,
            products: list,
            empty: list.length === 0,
            catname: catname,
            pages: pages,
        });

    router.get('/details', async function (req, res) {
        const id = req.query.id;
        const product = await productModel.findById(id);
        if (product === null) {
            return res.redirect('/');
        }
        
        res.render('vwProducts/details', {
            req: req,
            product: product
        });
    });

});

export default router;