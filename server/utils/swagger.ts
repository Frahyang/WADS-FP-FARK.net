import swaggerJsdoc from 'swagger-jsdoc';
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'My API',
        version: '1.0.0',
        description: 'TypeScript Express API with Swagger',
        },
        servers: [
        {
            url: 'http://localhost:3000',
        },
        ],
    },
    apis: ['./src/routes/*.ts'], // Point to your route files
};

export const swaggerSpec = swaggerJsdoc(options);
