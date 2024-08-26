const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const productsFilePath = path.join(__dirname, '../data/products.json');

// Función para leer el archivo de productos
const readProducts = () => {
    return fs.existsSync(productsFilePath) ? JSON.parse(fs.readFileSync(productsFilePath, 'utf-8')) : [];
};

// Función para escribir en el archivo de productos
const writeProducts = (data) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2));
};

// Rutas de productos
router.get('/', (req, res) => {
    const { limit } = req.query;
    let products = readProducts();
    if (limit) {
        products = products.slice(0, Number(limit));
    }
    res.json(products);
});

router.get('/:pid', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === Number(req.params.pid));
    if (!product) {
        return res.status(404).send('Producto no encontrado');
    }
    res.json(product);
});

router.post('/', (req, res) => {
    const products = readProducts();
    const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        price: req.body.price,
        status: req.body.status !== undefined ? req.body.status : true,
        stock: req.body.stock,
        category: req.body.category,
        thumbnails: req.body.thumbnails || []
    };

    // Validar campos obligatorios
    if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
        return res.status(400).send('Todos los campos son obligatorios, excepto thumbnails.');
    }

    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
    const products = readProducts();
    const index = products.findIndex(p => p.id === Number(req.params.pid));
    if (index === -1) {
        return res.status(404).send('Producto no encontrado');
    }
    const updatedProduct = { ...products[index], ...req.body };
    products[index] = updatedProduct;
    writeProducts(products);
    res.json(updatedProduct);
});

router.delete('/:pid', (req, res) => {
    const products = readProducts();
    const newProducts = products.filter(p => p.id !== Number(req.params.pid));
    if (products.length === newProducts.length) {
        return res.status(404).send('Producto no encontrado');
    }
    writeProducts(newProducts);
    res.status(204).send();
});

module.exports = router;
