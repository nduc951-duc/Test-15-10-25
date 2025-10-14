import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import hbs_sections from 'express-handlebars-sections';

// Import model và router cần thiết cho bài thi
import * as categoryModel from './models/category.model.js';
import articleRouter from './routes/article.route.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// 1. CẤU HÌNH VIEW ENGINE
app.engine('handlebars', engine({
    helpers: {
      // Helper này sẽ giúp hiển thị nội dung HTML trong trang chi tiết
      // mà không bị Handlebars escape (chuyển các thẻ < > thành &lt; &gt;)
      fillContent: hbs_sections(),
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// 2. CẤU HÌNH MIDDLEWARE
// Middleware để xử lý dữ liệu từ form POST
app.use(express.urlencoded({ extended: true }));

// Middleware để phục vụ các file tĩnh (CSS, JS, hình ảnh)
app.use('/static', express.static('static'));

// 3. MIDDLEWARE & ROUTING
// Middleware toàn cục: Lấy danh sách chuyên mục để hiển thị trên layout
app.use(async function (req, res, next) {
    try {
        const categories = await categoryModel.findAll();
        res.locals.globalCategories = categories; // Gán vào res.locals để tất cả view đều dùng được
        next();
    } catch (error) {
        console.error("Lỗi khi lấy danh sách chuyên mục:", error);
        next(error);
    }
});

// Route chính
// Trang chủ sẽ chuyển hướng thẳng đến trang danh sách bài viết
app.get('/', function (req, res) {
    res.redirect('/articles');
});

// Gắn router xử lý các yêu cầu liên quan đến '/articles'
app.use('/articles', articleRouter);

// 4. XỬ LÝ LỖI
// Middleware xử lý lỗi 404 (khi không tìm thấy route)
app.use(function(req, res){
    res.status(404).render('404', { layout: false }); // Render trang 404 không cần layout
});

// Middleware xử lý lỗi chung (lỗi 500)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 5. KHỞI ĐỘNG SERVER
const PORT = 3000;
app.listen(PORT, function () {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});