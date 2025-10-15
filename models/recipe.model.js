import db from '../utils/db.js';

export function findAllWithCuisineId() {
    return db('recipes')
        .join('cuisines', 'recipes.cuisine_id', 'cuisines.id')
        .select('recipes.*', 'cuisines.name');
}

export function findById(id) {
    return db('recipes').where('id', id).first();
}

export function add(recipe) {
    return db('recipes').insert(recipe).returning('*');
}

export function findAllWithCuisine() {
    return db('recipes')
        .join('cuisines', 'recipes.cuisine_id', 'cuisines.id') // JOIN hai bảng tại đây
        .select(
            'recipes.*',
            'cuisines.name as cuisine_name' // Lấy cột 'name' từ bảng cuisines và đổi tên thành 'cuisine_name'
        );
}

export default {
    findAllWithCuisineId,
    findById,
    add,
    findAllWithCuisine
}