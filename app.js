import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import hbs_sections from 'express-handlebars-sections';
import session from 'express-session';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();


app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'abcdxyz',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.authUser = req.session.authUser;
    next();
  });

app.engine('handlebars', engine({
    helpers: {
        isAuthenticated: function (req, options) {
            if (req.session && req.session.authUser) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
      fillContent: hbs_sections(),
      format_number(value) {
        return new Intl.NumberFormat('en-US').format(value);
      }
    }
  }));
  
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('static'));

app.set('view engine', 'handlebars');
app.set('views', './views');



app.use('/static', express.static('static'));


app.get('/about', function (req, res) {
    res.sendFile(__dirname + '/about.html');
});

app.get('/about-my-team', function (req, res) {
    res.sendFile(__dirname + '/about-my-team.html');
});

app.get('/about-Vo-Cam-Chuong', function (req, res) {
    res.sendFile(__dirname + '/about-Vo-Cam-Chuong.html');
});

app.get('/about-Tran-Nguyen-Minh-Cuong', function (req, res) {
    res.sendFile(__dirname + '/about-Tran-Nguyen-Minh-Cuong.html');
});

app.get('/about-Do-Duc-Manh', function (req, res) {
    res.sendFile(__dirname + '/about-Do-Duc-Manh.html');
});

app.get('/about-To-Duc-An', function (req, res) {
    res.sendFile(__dirname + '/about-To-Duc-An.html');
});

app.get('/about-Nguyen-Truong-Nhu', function (req, res) {
    res.sendFile(__dirname + '/about-Nguyen-Truong-Nhu.html');
});

app.get('/about-Tran-Huu-Duc', function (req, res) {
    res.sendFile(__dirname + '/about-Tran-Huu-Duc.html');
});

app.get('/bs', function (req, res) {
    res.sendFile(__dirname + '/bs.html');
});

import * as categoryModel from './models/category.model.js';
app.use(async function (req, res, next) {
    const list = await categoryModel.findAll();
    res.locals.globalCategories = list;

    next();
});

app.get('/', async function (req, res) {
    
    if(req.session.isAuthenticated){    
    console.log('User: ', req.session.authUser);
    } else console.log('User: none');

    const categories = await categoryModel.findAll();
    res.render('home', {
        req: req,
        categories: categories
    });
});

import accountRouter from './routes/account.route.js';
app.use('/account', accountRouter);

import categoryRouter from './routes/category.route.js';
app.use('/admin/categories', categoryRouter);

import productRouter from './routes/product.route.js';
app.use('/products', productRouter);

app.listen(3000, function () {
    console.log('Server is running on port 3000');
});