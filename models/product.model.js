import db from '../utils/db.js';

export function findByCat(catId) {
    return db('products')
    .where('catid', catId);
}

export function findById(id){
    return db('products')
    .where('proid', id)
    .first();
}

export function findPageByCat(catid,offset,limit){
    return db('products')
    .where('catid', catid)
    .limit(limit)
    .offset(offset);
}

export function countByCat(catid){
    return db('products')
    .where('catid', catid)
    .count('catid as amount')
    .first();
}

export function search(keyword){
    return db('products')
    .whereRaw(`fts @@ to_tsquery(remove_accents(?))`, [keyword]);
}

export function findAll(){
    return db('products');
}

export function add(product){
    return db('products').insert(product).returning('proid');
}
