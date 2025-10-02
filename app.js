import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import hbs_sections from 'express-handlebars-sections';
import session from 'express-session';

import accountRouter from './routes/account.route.js';
import { restrict, restrictAdmin } from './middlewares/auth.mdw.js';
import categoryRouter from './routes/category.route.js';
import productRouter from './routes/product.route.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();


app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'abcdxyz',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

app.use(function (req, res, next) {
    if (req.session.isAuthenticated) {
      res.locals.isAuthenticated = true;
      res.locals.authUser = req.session.authUser;
    }
    next();
  });
  

  app.engine('handlebars', engine({
    helpers: {
      // thêm helper định dạng số
      format_number(value) {
        return new Intl.NumberFormat('en-US').format(value);
      },
      // nếu bạn đã dùng hbs_sections trước đó, giữ nó
      fillContent: hbs_sections(),
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

app.use('/products', productRouter);

app.use('/account', accountRouter);

app.use('/admin/categories', restrict, restrictAdmin, categoryRouter);

app.use(function(req, res){
    res.status(404).render('404');
});

app.listen(3000, function () {
    console.log('Server is running on port 3000');
});