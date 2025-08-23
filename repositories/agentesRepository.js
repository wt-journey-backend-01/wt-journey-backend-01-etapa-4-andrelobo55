const db = require('../db/db');

async function create(object) {
    const [created] = await db('agentes').insert(object).returning('*');
    return created;
}

async function readById(id) {
    const result = await db('agentes').where({ id: id });
    return result[0];
}

async function readAll() {
    const result = await db('agentes').select(["*"]);
    return result;
}

async function update(id, fieldsToUpdate) {
    const [updated] = await db('agentes').where({ id: id }).update(fieldsToUpdate).returning("*");
    return updated;
}

async function remove(id) {
    const deleted = await db('agentes').where({ id: id }).del();
    return true;
}

module.exports = { create, readById, readAll, update, remove }