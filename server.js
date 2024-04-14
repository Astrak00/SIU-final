/*En este ejemplo, se utiliza Express.js 
Para ejecutar este API, debes tener instalados Express.js y body-parser. 
Puedes instalarlos utilizando npm bash
npm install express body-parser
*/
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const app = express();
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const productsFilePath = './products.json';

products = [];
// Cargar todos los productos disponibles
function load_all_products() {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf8');
        products = JSON.parse(data);
    } catch (err) {
        console.error('Error al cargar la lista de contactos:', err);
    }
}

// Meter en el carro de alguien
function load_favourites() {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf8');
        products = JSON.parse(data);
    } catch (err) {
        console.error('Error al cargar la lista de contactos:', err);
    }
}

// Guardar la lista de contactos en agenda.json
function save_favourite() {
    try {
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    } catch (err) {
        console.error('Error al guardar la lista de contactos:', err);
    }
}


// Set the context root
app.set('baseUrl', '/http://localhost:3000/tienda');

// Get all products
app.get('/tienda', (req, res) => {
    res.send(products);
});
// Get counter
app.get('/tienda/:counter', (req, res) => {
    try{
        let id =  products[products.length-1].id;
        res.send(String(id));
    }
    catch{
        let id = 0;
        res.send(String(id));
    }
    
});

// Add a new product
app.post('/tienda', (req, res) => {
    const newProduct = req.body;
    products.push(newProduct);
    save_favourite();
    res.status(201).send(newProduct);
});


// Delete a contact
app.delete('/tienda/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex < 0) return res.status(404).send({ message: 'Product not found' });
    products.splice(productIndex, 1);
    save_favourite();
    res.sendStatus(204);
});

// Redirect all other requests to the context root
app.all('*', (req, res) => {
    res.redirect('/www');
});

load_all_products();

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});