/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('casos').del()
  await knex('casos').insert([
    {titulo: 'Asilo Arkham', descricao: 'Série de crimes violentos', status: 'aberto', agente_id: 2},
    {titulo: 'Cão dos Bakersville', descricao: 'Assassinatos na Casa de Bakersville', status: 'solucionado', agente_id: 1},
    {titulo: 'Gotham City', descricao: 'Homicídios misteriosos na cidade', status: 'aberto', agente_id: 3}
  ]);
};