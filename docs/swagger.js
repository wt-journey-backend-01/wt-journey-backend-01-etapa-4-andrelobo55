const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Departamento de Polícia",
            version: "1.0.0",
            description: "API para gerenciamento de casos de polícia"
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: "Servidor local de desenvolvimento"
            },
        ],
    },
    apis: ['./routes/agentesRoutes.js', './routes/casosRoutes.js'],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger (app) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;