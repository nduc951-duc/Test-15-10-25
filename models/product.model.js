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

