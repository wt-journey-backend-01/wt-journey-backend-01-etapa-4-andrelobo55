/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('agentes').del()
  await knex('agentes').insert([
    { id: 1, nome: 'Sherlock Holmes', dataDeIncorporacao: '2022-01-24', cargo: 'detetive' },
    { id: 2, nome: 'Gordon', dataDeIncorporacao: '2024-10-08', cargo: 'delegado' },
    { id: 3, nome: 'Bruce Wayne', dataDeIncorporacao: '2022-01-24', cargo: 'investigador' }
  ]);
};