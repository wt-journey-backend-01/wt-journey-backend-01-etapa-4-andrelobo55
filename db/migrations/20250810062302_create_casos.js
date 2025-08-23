/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('casos', function(table) {
    table.increments('id').primary();
    table.string('titulo').notNullable();
    table.text('descricao').notNullable();
    table.enum('status', ["aberto", "solucionado"]).notNullable();
    table.integer("agente_id").unsigned().notNullable();

    table.foreign('agente_id').references('id').inTable('agentes').onDelete("cascade");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('casos');
};