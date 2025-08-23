/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('agentes').del()
  await knex('agentes').insert([
    {nome: 'Sherlock Holmes', dataDeIncorporacao: '2022-01-24', cargo: 'detetive'},
    {nome: 'Gordon', dataDeIncorporacao: '2024-10-08', cargo: 'delegado'},
    {nome: 'Bruce Wayne', dataDeIncorporacao: '2022-01-24', cargo: 'investigador'}
  ]);
};