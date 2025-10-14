import db from '../utils/db.js';

export function findAllWithCategories() {
    return db('articles')
        .join('categories', 'articles.category_id', 'categories.id')
        .select('articles.*', 'categories.category_name');
}

export function findById(id) {
    return db('articles').where('id', id).first();
}

export function add(article) {
    return db('articles').insert(article).returning('*');
}

export default {
    findAllWithCategories,
    findById,
    add
}