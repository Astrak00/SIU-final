/*En este ejemplo, se utiliza Express.js 
Para ejecutar este API, debes tener instalados Express.js y body-parser. 
Puedes instalarlos utilizando npm bash
npm install express body-parser
*/
const cors = require('cors');
const express = require('express');
const http = require('http');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});


app.use(cors());
app.use(express.json());

const productsFilePath = './products.json';
let products = [];

let current_user = null;
let favourite_products = {};

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
        const data = fs.readFileSync("./favourite_products.json", 'utf8');
        favourite_products = JSON.parse(data);
        return 0;
    } catch (err) {
        socket.emit('addProductResult', { success: false, message: 'Error al cargar la lista' });
        console.error('Error al guardar la lista de contactos:', err);
        return -1;
    }
}

// Guardar la lista de contactos en agenda.json
function save_favourite(socket) {
    fs.writeFile('./favourite_products.json', JSON.stringify(favourite_products, null, 2), (err) => {
        if (err) {
            socket.emit('addProductResult', { success: false, message: 'Error al guardar la lista' });
            console.error('Error al guardar la lista de productos:', err);
            return 0;
        }
        else{
            return 0;
        }
    });
}



// Registros de usuarios
const users = [
    { username: '1', password: '1', id: 1 },
    { username: 'user2', password: 'password2', id: 2 }
];

// Función para autenticar usuarios
function authenticateUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
}

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');


    load_all_products();
    // Enviar la lista de productos al cliente cuando se conecta
    socket.emit('products', products);

    // Agregar un nuevo producto
    socket.on('addProduct', (newProduct) => {
        console.log("Recibida");
        if (current_user == null){
            console.log(favourite_products);
            socket.emit("addProductResult", {success: false, message: "El usuario no iniciado sesión"})
        }
        else{
            if (load_favourites() != 0){
                return;
            }
            console.log(favourite_products);            
            // Agregar artículos al usuario1
            if (favourite_products[current_user] == null){
                favourite_products[current_user] = [];
            }
            if (favourite_products[current_user].find(product => product.name === newProduct.name)){
                socket.emit('addProductResult', { success: true, message: 'Producto ya está en la lista' });
                return;
            }
            favourite_products[current_user].push(newProduct);
            // Guardar los cambios de vuelta al archivo JSON
            if (save_favourite() != 0){
                return;
            }
            
            socket.emit('addProductResult', { success: true, message: 'Producto guradado correctamente' });
        }
    });

    // Eliminar un producto
    socket.on('deleteProduct', (productId) => {
        const index = products.findIndex(product => product.id === productId);
        if (index !== -1) {
            products.splice(index, 1);
            save_favourite();
            io.emit('productDeleted', productId);
        }
    });
    // Manejar el evento de inicio de sesión
    socket.on('login', function(credentials) {
        const { username, password } = credentials;
        // Aquí verificarías las credenciales de inicio de sesión
        console.log("Buscamos el usuario");
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            // Inicio de sesión exitoso
            current_user = username;
            socket.emit('loginResult', { success: true });
        } else {
            console.log("Usuario NO existe");
            // Inicio de sesión fallido
            socket.emit('loginResult', { success: false, message: 'Credenciales inválidas' });
        }
        
    });
    socket.on('loadFavourites', function(){
        if (current_user == null){
            console.log(favourite_products);
            socket.emit("loadFavouritesResult", {success: false, message: "El usuario no iniciado sesión"})
        }
        else{
            if (load_favourites() != 0){
                socket.emit("loadFavouritesResult", {success: false, message: "Error al cargar la lista"})
                return;
            }
            console.log("Mandando la lista", favourite_products[current_user]);
            socket.emit('loadFavouritesResult', favourite_products[current_user]);
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});



