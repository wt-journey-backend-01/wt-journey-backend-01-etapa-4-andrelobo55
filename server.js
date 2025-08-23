const express = require('express');
const app = express();
const PORT = 3000;
const agentesRoutes = require("./routes/agentesRoutes");
const casosRoutes = require("./routes/casosRoutes");
const setupSwagger = require('./docs/swagger');

app.use(express.json());
app.use("/agentes", agentesRoutes);
app.use("/casos", casosRoutes);
setupSwagger(app);

app.use((err, req, res, next) => {
  if (err.name === 'API Error') {
    return res.status(err.status).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`);
});