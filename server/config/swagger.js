var swaggerJSDoc = require('swagger-jsdoc');
var config = require('config');
const swaggerDefinition = {
    info: {
        title: 'Logitech API\'S',
        version: '1.0.0',
        description: 'Logitech',
    },
    basePath: config.get('v1_base_path')
};
const options = {
    swaggerDefinition,
    apis: ['docs/*_swagger.js'], // <-- not in the definition, but in the options
};
var swaggerSpec = swaggerJSDoc(options);
module.exports = {
    swaggerSpec
};