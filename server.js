const express = require('express');
const app = express();
const PORT = 3000;
const agentesRoutes = require("./routes/agentesRoutes");
const casosRoutes = require("./routes/casosRoutes");
const authRoutes = require('./routes/authRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const setupSwagger = require('./docs/swagger');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use("/agentes", agentesRoutes);
app.use("/casos", casosRoutes);
app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);
app.use(cookieParser());
setupSwagger(app);

app.use((err, req, res, next) => {
  if (err.name === 'APIError') {
    return res.status(err.status).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`);
});