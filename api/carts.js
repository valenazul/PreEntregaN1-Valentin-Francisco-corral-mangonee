const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const cartsFilePath = path.join(__dirname, '../data/carts.json');

// Función para leer el archivo de carritos
const readCarts = () => {
    return fs.existsSync(cartsFilePath) ? JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8')) : [];
};

// Función para escribir en el archivo de carritos
const writeCarts = (data) => {
    fs.writeFileSync(cartsFilePath, JSON.stringify(data, null, 2));
};

// Rutas de carritos
router.post('/', (req, res) => {
    const carts = readCarts();
    const newCart = {
        id: carts.length ? carts[carts.length - 1].id + 1 : 1,
        products: []
    };
    carts.push(newCart);
    writeCarts(carts);
    res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id === Number(req.params.cid));
    if (!cart) {
        return res.status(404).send('Carrito no encontrado');
    }
    res.json(cart.products);
});

router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id === Number(req.params.cid));
    if (!cart) {
        return res.status(404).send('Carrito no encontrado');
    }
    
    const productToAdd = { product: Number(req.params.pid), quantity: 1 };
    const existingProduct = cart.products.find(p => p.product === productToAdd.product);
    
    if (existingProduct) {
        existingProduct.quantity += 1; // Incrementar cantidad si ya existe
    } else {
        cart.products.push(productToAdd); // Agregar nuevo producto
    }

    writeCarts(carts);
    res.status(201).json(cart);
});

module.exports = router;
