const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  // Apaga todos os registros anteriores
  await knex("usuarios").del();

  // Gera hash da senha
  const hashedPassword = await bcrypt.hash("senha@rafael", 10);

  // Insere usuário
  await knex("usuarios").insert([
    { nome: "Rafael", email: "rafael@gmail.com", senha: hashedPassword }
  ]);
};