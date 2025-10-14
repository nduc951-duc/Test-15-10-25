import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as productModel from '../models/product.model.js';
import { get } from 'http';


const router = express.Router();

router.get('/', async function (req, res) {
    const list = await productModel.findAll();
    res.render('vwAdminProduct/list',{
        req:req,
         products: list
    });
});
    

router.get('/add', function (req, res) {
    res.render('vwAdminProduct/add');
});

function get_raw_value(value){
    return value.replace(/,/g, '');
}

router.post('/add', async function (req, res) {
    const product = {
        proname: req.body.proname,
        price: get_raw_value(req.body.price),
        quantity: get_raw_value(req.body.quantity),
        catid: req.body.catid,
        tinydes: req.body.tinydes,
        fulldes: req.body.fulldes,
    };

    //Tao thu muc voi proid san pham moi them vo
    const ret = await productModel.add(product);
    const proid = ret[0].proid;
    const dirPath = path.join('static', 'imgs', 'sp', proid.toString());
    if(!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath, { recursive: true });            // Nho import ben tren
    }

    //move cac file anh tu file temp vao thu muc moi tao o tren
    if(req.body.photos){
        const photos = JSON.parse(req.body.photos);
        let i = 0;
        for(const p of photos)
        {
            const oldPath = path.join('static', 'temp_uploads', p);
            const newPath = path.join(dirPath, p);
            if(i===0){
                const mainPath = path.join(dirPath, 'main.jpg');
                const thumbsPath = path.join(dirPath, 'main_thumbs.jpg');
                fs.copyFileSync(oldPath, mainPath);
                fs.copyFileSync(oldPath, thumbsPath);
            }else {
                const subPath= path.join(dirPath, `${i}.jpg`);
                const subThumbsPath= path.join(dirPath, `${i}_thumbs.jpg`);
                fs.copyFileSync(oldPath, subPath);
                fs.copyFileSync(oldPath, subThumbsPath);
            }
            fs.unlinkSync(oldPath);
            i++;


        }
    }

    res.redirect('/admin/products/add');
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './static/temp_uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});


const upload = multer({ storage: storage });

router.post('/upload', upload.array('photos', 5), function (req, res) {
    const photos = req.files.photos;

    res.json({
        success: true,
        files: req.files,
    });
});



export default router;