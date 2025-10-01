import db from '../utils/db.js';

export function findAll(){
    return db('categories')
    .orderBy('catid');
}

export function add(category){
    return db('categories')
    .insert(category).returning('*');
}


export function findById(id){
    return db('categories')
    .where('catid', id)
    .first();
}

export function patch(id, category) {
    return db('categories')
    .where('catid', id)
    .update(category);
}
  

export function del(id){
    return db('categories')
    .where('catid', id)
    .del();
}