const db = require('../db/db');

async function create(user) {
    const [created] = await db('usuarios').insert(user).returning("*");
    return created;
}

async function readAll() {
    const result = await db('usuarios').select("*");
    return result;
}

async function readById(id) {
    const result = await db('usuarios').where({ id: id }).first();
    return result;
}

async function readByEmail(email) {
    const result = await db('usuarios').where({ email: email }).first();
    return result;
}

async function update(id, user) {
    const updated = await db('usuarios').where({ id: id }).update(user).returning("*").first();
    return updated;
}

async function patch(id, fields) {
    const updated = await db('usuarios').where({ id: id }).update(fields).returning("*").first();
    return updated;
}

async function remove(id) {
    const deleted = await db('usuarios').where({ id: id }).del();
    return deleted;
}

module.exports = { create, readAll, readById, readByEmail, update, patch, remove };