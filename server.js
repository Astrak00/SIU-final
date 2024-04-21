/*En este ejemplo, se utiliza Express.js 
Para ejecutar este API, debes tener instalados Express.js y body-parser. 
Puedes instalarlos utilizando npm bash
npm install express body-parser
*/
const cors = require("cors");
const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path"); // Import the path module

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, ".")));

const productsFilePath = "./products.json";
let products = [];

let active_users = [];
let favourite_products = {};
let tiendas = [];

// Cargar todos los productos disponibles en el archivo products.json
function load_all_products() {
  try {
    const data = fs.readFileSync(productsFilePath, "utf8");
    products = JSON.parse(data);
  } catch (err) {
    console.error("Error al cargar la lista de contactos:", err);
  }
}
function load_all_stores() {
  try {
    const data = fs.readFileSync("./shops.json", "utf8");
    tiendas = JSON.parse(data);
  } catch (err) {
    console.error("Error al cargar la lista de tiendas:", err);
  }
}

// Meter en el carro de alguien
function load_favourites(socket) {
  return new Promise((resolve, reject) => {
    try {
      const data = fs.readFileSync("./favourite_products.json", "utf8");
      favourite_products = JSON.parse(data);
      resolve(0); // Resuelve la promesa con éxito
    } catch (err) {
      socket.emit("addProductResult", {
        success: false,
        message: "Error al cargar la lista",
      });
      console.error("Error al cargar la lista de contactos:", err);
      reject(err); // Rechaza la promesa en caso de error
    }
  });
}

// Guardar la lista del carrito en el archivo JSON
function save_favourite() {
  return new Promise((resolve, reject) => {
    try {
      // Escribir los nuevos datos en el archivo JSON
      fs.writeFile(
        "./favourite_products.json",
        JSON.stringify(favourite_products, null, 2),
        (err) => {
          if (err) {
            //console.error("Error al guardar la lista de productos:", err);
            reject(err); // Rechazar la promesa si hay un error
          } else {
            //console.log(`Lista de productos guardada correctamente.`);
            resolve(0); // Resolver la promesa si la operación es exitosa
          }
        }
      );
    } catch (err) {
      //console.error("Error al guardar la lista de productos:", err);
      reject(err); // Rechazar la promesa en caso de error
    }
  });
}

// Usuarios registrados por defecto
const users = [{ username: "1", password: "1", id: 1 }];

// Función para autenticar usuarios, devuelve el usuario si las credenciales son válidas
function authenticateUser(username, password) {
  return users.find(
    (user) => user.username === username && user.password === password
  );
}

// Uso de las conexiones de Socket.IO
io.on("connection", (socket) => {
  // Cuando un usuario se conecta, añadirlo a la lista de usuarios activos y cargar los productos
  active_users.push({ id: socket.id, username: null });
  load_all_products();

  // Enviar la lista de productos
  socket.emit("products", products);

  // Agregar un nuevo producto al carrito del usuario
  socket.on("addProduct", async (newProduct) => {
    if (active_users.find((user) => user.id === socket.id).username == null) {
      socket.emit("addProductResult", {
        success: false,
        message: "El usuario no iniciado sesión",
      });
      return;
    }
    try {
      if ((await load_favourites(socket)) != 0) {
        socket.emit("addProductResult", {
          success: false,
          message: "Error al cargar la lista",
        });
        return;
      }

      // Comprobar que el usuario es el actual.
      current_user = active_users.find(
        (user) => user.id === socket.id
      ).username;

      if (favourite_products[current_user] == null) {
        favourite_products[current_user] = [];
      }
      if (
        favourite_products[current_user].find(
          (product) => product.name === newProduct.name
        )
      ) {
        socket.emit("addProductResult", {
          success: true,
          message: "Producto ya está en la lista",
        });
        return;
      }
      favourite_products[current_user].push(newProduct);

      // Guardar los cambios de vuelta al archivo JSON
      if ((await save_favourite()) != 0) {
        socket.emit("addProductResult", {
          success: false,
          message: "Erro al guardar el producto",
        });
      }

      // Emitir un mensaje de éxito
      socket.emit("addProductResult", {
        success: true,
        message: "Producto guardado correctamente",
      });
    } catch (error) {
      // Si existe un error, envia un mensaje de error por el socket
      console.error("Error en la operación de agregar producto:", error);
      socket.emit("addProductResult", {
        success: false,
        message: "Error al agregar producto",
      });
    }
  });

  // Eliminar un producto por su nombre
  socket.on("deleteProduct", async (productId) => {
    if ((await load_favourites(socket)) != 0) {
      socket.emit("productDeleted", {
        success: false,
        message: "Error al cargar la lista",
      });
      return;
    }
    // Comprobar que el usuario esté iniciado sesión.
    current_user = active_users.find((user) => user.id === socket.id).username;
    if (current_user == null) {
      socket.emit("productDeleted", {
        success: false,
        message: "Primero tienes que iniciar sesión",
      });
      return; // Agregar un return para salir de la función si el usuario no está registrado
    }
    const index = favourite_products[current_user].findIndex(
      (product) => product.name === productId
    );
    // Si el producto no existe, devolvemos una excepción.
    if (index !== -1) {
      favourite_products[current_user].splice(index, 1);
      if ((await save_favourite()) != 0) {
        console.log("Error al guardar la lista tras borrar el producto");
        socket.emit("productDeleted", {
          success: false,
          message: "Error al borrar el producto",
        });
        return; // Agregar un return para salir de la función si hay un error al guardar
      }
      socket.emit("productDeleted", {
        success: true,
        message: favourite_products[current_user],
      });
    } else {
      socket.emit("productDeleted", {
        success: false,
        message: "Error al borrar el producto",
      });
    }
  });

  // Manejar el evento de inicio de sesión
  socket.on("login", async function (credentials) {
    const { username, password } = credentials;
    // Aquí verificarías las credenciales de inicio de sesión
    console.log("Buscamos el usuario");
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      // Inicio de sesión exitoso
      active_users.find((user) => user.id === socket.id).username = username;
      socket.emit("loginResult", { success: true });
    } else {
      console.log("Credenciales inválidas");
      // Inicio de sesión fallido
      socket.emit("loginResult", {
        success: false,
        message: "Credenciales inválidas",
      });
    }
  });

  // Manejar el evento de registro
  socket.on("signup", async function (credentials) {
    const { username, password } = credentials;
    console.log({ username, password });
    // Comprueba si el usuario ya existe en la base de datos.
    const user = users.find((user) => user.username === username);

    if (user) {
      // Si el usuario ya existe, mandar error
      socket.emit("signupResult", {
        success: false,
        message: "El usuario ya existe",
      });
      return;
    }

    const id = 4;

    const newUser = {
      username,
      password,
      id,
    };

    // Añadimos el nuevo usuario y le asignamos el id del socket
    users.push(newUser);
    active_users.find((user) => user.id === socket.id).username = username;

    socket.emit("signupResult", {
      success: true,
      message: "Cuenta creada con exito",
    });
  });

  // Manejar el evento de carga de favoritos a la lista de ese usuario
  socket.on("loadFavourites", async function () {
    current_user = active_users.find((user) => user.id === socket.id).username;
    if (current_user == null) {
      socket.emit("loadFavouritesResult", {
        success: false,
        message: "El usuario no iniciado sesión",
      });
    } else {
      if ((await load_favourites(socket)) != 0) {
        socket.emit("loadFavouritesResult", {
          success: false,
          message: "Error al cargar la lista",
        });
        return;
      }
      if (favourite_products[current_user] == null) {
        favourite_products[current_user] = [];
      }

      socket.emit("loadFavouritesResult", {
        success: true,
        message: favourite_products[current_user],
      });
    }
  });

  // Envia al usuario su lista de favoritos
  socket.on("loadFavouritesFromUser", async function (user_temp) {
    console.log(user_temp);
    if ((await load_favourites(socket)) != 0) {
      socket.emit("loadFavouritesResult", {
        success: false,
        message: "Error al cargar la lista",
      });
      return;
    }
    if (favourite_products[user_temp] == null) {
      favourite_products[user_temp] = [];
    }

    socket.emit("loadFavouritesResult", {
      success: true,
      message: favourite_products[user_temp],
    });
  });

  /////// ADMIN ///////
  // Manejar el evento de añadir un nuevo producto
  socket.on("newProduct", (jsonData) => {
    const newProduct = JSON.parse(jsonData);
    products.push(newProduct);
    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.error("Error al guardar el producto:", err);
        socket.emit("productAdded", { success: false });
      } else {
        socket.emit("productAdded", { success: true });
      }
    });
  });

  // Manejar el evento de mover al usuario a la página de pago
  socket.on("realizarPago", () => {
    console.log("Se va a cambiar al usuario a la pagina de pago");
    socket.emit(
      "redirectPago",
      active_users.find((user) => user.id === socket.id).username
    );
  });

  // Manejar el evento de pago realizado
  socket.on("paymentMade", (data) => {
    let user = data.user;
    let payment = data.payment;
    console.log("Pago realizado por", user, "con", payment);
    // Eliminar los productos del carrito
    favourite_products[user] = [];
  });

  // Manejar el evento de desconexión del usuario, borra al usuario de la lista de activos
  socket.on("disconnect", () => {
    active_users = active_users.filter((user) => user.id !== socket.id);
  });

  // Manejar el evento de petición de tiendas
  socket.on("request_stores", async function () {
    load_all_stores();
    socket.emit("request_stores_result", tiendas);
    console.log(tiendas);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
