const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require('./api/products');
const cartsRouter = require('./api/carts');

const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.json());

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
