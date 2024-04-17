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


load_all_products();



// Registros de usuarios
const users = [
    { username: 'user1', password: 'password1', id: 1 },
    { username: 'user2', password: 'password2', id: 2 }
];

// Función para autenticar usuarios
function authenticateUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
}

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Enviar la lista de productos al cliente cuando se conecta
    socket.emit('products', products);

    // Agregar un nuevo producto
    socket.on('addProduct', (newProduct) => {
        products.push(newProduct);
        save_favourite();
        io.emit('productAdded', newProduct);
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
        // Aquí verificarías las credenciales de inicio de sesión
        const { username, password } = credentials;
        console.log("recibida petición: ", username, password);
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
        console.log("Usuario existe");
          // Inicio de sesión exitoso
          socket.emit('loginResult', { success: true });
        } else {
            console.log("Usuario NO existe");
          // Inicio de sesión fallido
          socket.emit('loginResult', { success: false, message: 'Credenciales inválidas' });
        }
      });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});



