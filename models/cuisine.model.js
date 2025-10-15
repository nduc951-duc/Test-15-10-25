import db from '../utils/db.js';

export function findAll(){
    return db('cuisines')
    .orderBy('id');
}
