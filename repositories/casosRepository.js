const db = require('../db/db');

async function create(object) {
    const [created] = await db('casos').insert(object).returning("*");
    return created;
}

async function readById(id) {
    const result = await db('casos').where({ id: id });
    return result[0];
}

async function readAll() {
    const result = await db('casos').select(["*"]);
    return result;
}

async function update(id, fieldsToUpdate) {
    const [updated] = await db('casos').where({ id: id }).update(fieldsToUpdate).returning("*");
    return updated;
}

async function remove(id) {
    const deleted = await db('casos').where({ id: id }).del();
    return true;
}

module.exports = { create, readById, readAll, update, remove }