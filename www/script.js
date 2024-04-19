// En el archivo JavaScript del cliente
const socket = io("http://localhost:3000");

var all_products = [];
var fav_products = [];

const comandos_viajar_carro = ["carrito", "carro", "favoritos", "guardados", "cesta", "volver", "pagina principal"];
const comandos_sesion = ["login", "log in", "sign up", "sesion", "signup", "china", "iniciar sesion", "suscribirse", "crear cuenta", "acceso", "inicio de sesion"];

socket.on("products", (data) => {
  all_products = data;
  console.log("Productos recibidos");
  renderlist(data);
});

socket.on("loginResult", function (result) {
  if (result.success) {
    showModal("Inicio de sesión exitoso", 0);
    displayMain();
  } else {
    // Inicio de sesión fallido, mostrar mensaje de error
    showModal(result.message, 1);
  }
});
socket.on("signupResult", function (result) {
  if (result.success) {
    showModal(result.message, 0);
    displayMain();
  } else {
    // Inicio de sesión fallido, mostrar mensaje de error
    showModal(result.message, 1);
  }
});

const cart_page = document.getElementById("carro");
const main_page = document.getElementById("main_page");
const form_page = document.getElementById("formularios");

function displayCart(){
  cart_page.style.display = "block";
  main_page.style.display = "none";
  form_page.style.display = "none";
  socket.emit("loadFavourites");
}

function displayForm() {
  cart_page.style.display = "none";
  main_page.style.display = "none";
  form_page.style.display = "block";
}

function displayMain(){
  cart_page.style.display = "none";
  main_page.style.display = "block";
  form_page.style.display = "none";
}

socket.on("addProductResult", function (result) {
  if (result.success) {
    showModal(result.message, 0);
    //alert(result.message);
  } else {
    // Inicio de sesión fallido, mostrar mensaje de error
    showModal(result.message, 1);
    //alert(result.message);
  }
  
});

socket.on("loadFavouritesResult", (data) => {
  if (data.success == false) {
    showModal(data.message, 1);
    return;
  }
  data = data.message;
  if (data.length == 0) {
    showModal("No hay productos en el carrito", 1);
    return;
  }
  fav_products = data;
  load_carrito(data);
});

socket.on("productDeleted", (data) => {
  if (data.success == false) {
    showModal(data.message, 1);
    return;
  }
  data = data.message;
  if (data.length == 0) {
    showModal("No hay productos en el carrito", 1);
    return;
  }
  fav_products = data;
  load_carrito(data);
});

// Función para agregar un producto
function addProduct(newProduct) {
  event.preventDefault();
  socket.emit("addProduct", newProduct);
}

// Función para eliminar un producto
function deleteProduct(productId) {
  socket.emit("deleteProduct", productId);
}

function showModal(message, err) {
  const modal = document.getElementById("error-modal");
  const errorMessageElement = document.getElementById("error-message");
  const box = document.getElementById("modal-content");
  if (err == 1) {
    box.style.backgroundColor = "lightcoral";
  } else {
    box.style.backgroundColor = "lightgreen";
  }
  errorMessageElement.textContent = message;
  modal.style.display = "block";

  // Cerrar automáticamente el modal después de 2 segundos
  setTimeout(() => {
    closeModal();
  }, 1100);
}

// Cerrar la caja de confirmaciones/errores
function closeModal() {
  const modal = document.getElementById("error-modal");
  modal.style.display = "none";
}

var product_list = [];

function renderlist(data) {
  event.preventDefault();
  const p_list = document.getElementById("products");
  p_list.textContent = "";
  //var myArray = JSON.parse(myJSON);
  // Nombre, precio, src, descripcion
  /*<img src="product2.jpg" alt="Product 2" />
          <h2>Producto 2</h2>
          <p>Precio: $15</p>
          <button onclick="addToCart('Product 2', 15)">
          */
  data.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("product");

    const img_product = document.createElement("img");
    img_product.src = `${product.imagen}`;
    img_product.alt = `${product.nombre}`;

    const name_product = document.createElement("h2");
    name_product.textContent = `${product.nombre}`;

    const category_product = document.createElement("h2");
    category_product.textContent = `${product.categoria}`;
    productElement.setAttribute(
      "data-categoria",
      product.categoria.toLowerCase()
    );

    const price_product = document.createElement("p");
    price_product.textContent = `${product.precio}`;
    productElement.setAttribute("data-precio", product.precio);

    const button_product = document.createElement("button");
    button_product.onclick = (event) => {
      addProduct({ name: product.nombre, price: product.precio });
    };

    button_product.classList.add("but");
    button_product.textContent = "Añadir al carrito";

    const descriptionHolder = document.createElement("span");
    descriptionHolder.textContent = `Descripción:`;
    const descriptionElement = document.createElement("span");
    descriptionElement.textContent = `${product.descripcion}\n`;

    // Agregar los elementos span al elemento de contacto
    productElement.appendChild(img_product);
    productElement.appendChild(name_product);
    productElement.appendChild(category_product);
    productElement.appendChild(price_product);
    productElement.appendChild(descriptionHolder);

    productElement.appendChild(descriptionElement);
    productElement.appendChild(button_product);

    // Agregar el elemento de contacto al elemento de lista de contactos
    p_list.appendChild(productElement);
  });
}

let currentIndex = 0;

function nextProduct() {
  currentIndex++;
  if (currentIndex >= fav_products.length) {
    currentIndex = 0;
  }
  load_carrito(fav_products);
}


function load_carrito(data) {
  const f_list = document.getElementById("cart-items");
  const total = document.getElementById("totalAmount");
  f_list.textContent = "";
  let amount = 0;
  data.forEach((product, index) => {
    const productElement = document.createElement("div");
    productElement.classList.add("product");
    /*
      const img_product = document.createElement('img');
      img_product.src= `${product.imagen}`;
      img_product.alt= `${product.nombre}`;
      */
    const name_product = document.createElement("h2");
    name_product.textContent = `${product.name}`;

    const price_product = document.createElement("p");
    price_product.textContent = `${product.price}`;

    const delete_button = document.createElement("img");
    delete_button.src = "./images/papelera.png";
    delete_button.style.width = "20px";
    delete_button.style.height = "20px";
    delete_button.onclick = (event) => {
      deleteProduct(product.name);
    };

    // Agregar los elementos span al elemento de contacto
    //productElement.appendChild(img_product);
    productElement.appendChild(name_product);
    productElement.appendChild(price_product);
    productElement.appendChild(delete_button);

    // Agregar el elemento de contacto al elemento de lista de contactos
    f_list.appendChild(productElement);
    amount += parseFloat(product.price);
    // Aplicar la clase 'selected' al producto seleccionado
    if (index === currentIndex) {
      productElement.classList.add("selected");
    }
  });
  total.textContent = amount;
}


function actulizarFiltroCategorias() {
  var categoriaSelect = document.getElementById("filtro-categoria");
  var unicasCategorias = {};

  var productos = document.querySelectorAll(".product");
  productos.forEach(function (product) {
    var categoria = product.dataset.categoria;
    unicasCategorias[categoria] = true;
  });

  categoriaSelect.innerHTML = "";
  // Añadimos 'Todos' como la opcion por defecto
  var defaultOption = document.createElement("option");
  defaultOption.value = "0";
  defaultOption.textContent = "Todos";
  categoriaSelect.appendChild(defaultOption);

  // Añadimos las otras categorias encontradas
  Object.keys(unicasCategorias).forEach(function (category) {
    var option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoriaSelect.appendChild(option);
  });
}

setTimeout(function () {
  actulizarFiltroCategorias();
}, 100);

function filterProducts() {
  var categoriaSelect = document.getElementById("filtro-categoria");
  var seleccionCategoria = categoriaSelect.value;
  var precioSelect = document.getElementById("filtro-precio");
  var seleccionPrecio = precioSelect.value;
  var products = document.querySelectorAll(".product");
  products.forEach(function (product) {
    var categoria = product.dataset.categoria;
    var precio = parseFloat(product.dataset.precio);
    if (seleccionCategoria === "0" || seleccionCategoria === categoria) {
      switch (seleccionPrecio) {
        case "0":
          product.style.display = "block";
          break;
        case "10":
          if (precio < 10.0) {
            product.style.display = "block";
          } else {
            product.style.display = "none";
          }
          break;
        case "30":
          if (precio >= 10.0 && precio <= 30.0) {
            product.style.display = "block";
          } else {
            product.style.display = "none";
          }
          break;
        case "100":
          if (precio >= 30.0 && precio <= 100.0) {
            product.style.display = "block";
          } else {
            product.style.display = "none";
          }
          break;
        case "200":
          if (precio >= 100.0 && precio <= 200.0) {
            product.style.display = "block";
          } else {
            product.style.display = "none";
          }
          break;
        case "-1":
          if (precio > 200.0) {
            product.style.display = "block";
          } else {
            product.style.display = "none";
          }
          break;
      }
    } else {
      product.style.display = "none";
    }
  });
}

document
  .getElementById("filtro-categoria")
  .addEventListener("change", filterProducts);

document
  .getElementById("filtro-precio")
  .addEventListener("change", filterProducts);

// Manejar el envío del formulario de inicio de sesión
function Submitform() {
  event.preventDefault();
  const username = document.getElementById("username").value.toString();
  const password = document.getElementById("password").value.toString();
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  // Enviar los datos de inicio de sesión al servidor a través de sockets
  socket.emit("login", { username, password });
}

// Manejar el envío del formulario de inicio de sesión
function Submitformsignup() {
  event.preventDefault();
  const username = document.getElementById("username_signup").value.toString();
  const password = document.getElementById("password_signup").value.toString();
  const verify = document.getElementById("password2").value.toString();
  document.getElementById("username_signup").value = "";
  document.getElementById("password_signup").value = "";
  document.getElementById("password2").value = "";
  if (verify !== password){
    showModal("Contraseñas no coinciden",1);
  }

  if (username.trim() == "" || username == null || password == null || password.trim() == ""){
    showModal("No se permiten campos vacíos",1);
    return;
  }
  // Enviar los datos de inicio de sesión al servidor a través de sockets
  socket.emit("signup", { username, password });
}

///////////// RECONOCIMIENTO POR VOZ ///////////////////
const voiceActivator = document.getElementById("voice_activator");
const voiceButton = document.getElementById("voiceButton");
const voiceContainer = document.getElementById("voice"); // Contenedor del reconocimiento por voz

// Función para mostrar el contenedor del reconocimiento por voz
function showMic() {
  voiceContainer.style.display = "flex";
}

// Verificar si el navegador admite la Web Speech API
if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();

  // Establecer el idioma del reconocimiento de voz
  recognition.lang = "es-ES";

  // Configurar el evento de resultado del reconocimiento de voz
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim().toLowerCase();
    console.log("Texto reconocido:", transcript);

    // remove the tildes and accents
    const transcriptNormalized = transcript
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "").trim().replace(/\.$/, '');
    console.log("Texto reconocido normalizado:", transcriptNormalized);
    
    let found = false;
    if (main_page.style.display == "block" || main_page.style.display == ""){
      all_products.forEach((product) => {
        if (!found){
          let aux = product.nombre.toLowerCase().normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "").trim();
          //console.log(aux, transcriptNormalized);
          //console.log(aux.includes(transcriptNormalized));
          if (aux.includes(transcriptNormalized)){
              addProduct({ name: product.nombre, price: product.precio });
              found = true;
              return false;
          }
        }
      });
    }
    else if (cart_page.style.display == "block"){
      all_products.forEach((product) => {
        if (!found){
          let aux = product.nombre.toLowerCase().normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "").trim();
          //console.log(aux, transcriptNormalized);
          //console.log(aux.includes(transcriptNormalized));
          if (aux.includes(transcriptNormalized)){
              deleteProduct(product.nombre);
              found = true;
              return false;
          }
        }
      });
      if (transcriptNormalized.includes("siguiente")){
        nextProduct();
        found = true;
      }
      else if (transcriptNormalized.includes("borrar")){
        deleteProduct(fav_products[currentIndex].name);
        found = true;
      }
    }
    else{
      voiceContainer.style.display = "none";
    }
    if (comandos_viajar_carro.includes(transcriptNormalized)){
      if (transcriptNormalized == "volver" || transcriptNormalized == "pagina principal"){
        displayMain();
      }
      else{
        displayCart();
      }
      found = true;
    }
    
    if (comandos_sesion.includes(transcriptNormalized)){
      displayForm();
      found = true;
    }    
    if (!found){
      showModal(`No reconocido producto ${transcriptNormalized}`, 1);
    }
    voiceContainer.style.backgroundColor = "white";
  };

  // Configurar el evento de error del reconocimiento de voz
  recognition.onerror = (event) => {
    console.error("Error en el reconocimiento de voz:", event.error);
  };

  // Configurar el evento click del botón de voz
  voiceContainer.addEventListener("click", (event) => {
    event.stopPropagation(); // Detener la propagación del clic para evitar que se cierre al hacer clic en el botón
    // Iniciar el reconocimiento de voz cuando se hace clic en el botón
    recognition.start();
    voiceContainer.style.backgroundColor = "#ff6666";
    console.log("Reconocimiento de voz iniciado");
  });

  // Event listener para cerrar la opción de reconocimiento por voz al hacer clic fuera del círculo o en el botón de voz
  document.addEventListener("click", (event) => {
    if (event.target !== voiceActivator) {
      voiceContainer.style.display = "none"; // Ocultar el contenedor del reconocimiento por voz
      recognition.abort(); // Detener el reconocimiento de voz
      voiceContainer.style.backgroundColor = "white";
      //console.log("Reconocimiento de voz detenido");
    }
  });
} else {
  // El navegador no admite la Web Speech API
  console.error("El navegador no admite la Web Speech API");
  voiceButton.disabled = true;
}


/////////////////// GIROSCOPIO ////////////////////////

let actionExecuted = false;

window.addEventListener('deviceorientation', (event) => {
  const beta = event.beta; 
  const gamma = event.gamma; 
  if (cart_page.style.display == "block" && !actionExecuted) {
    // Cambiar de producto si se inclina
    if (beta < 5) {
      console.log("Next");
      nextProduct();
      actionExecuted = true;
      setTimeout(() => {
        actionExecuted = false;
      }, 1000);
    }
    
    // Borrar si se gira a la derecha
    if (gamma > 35) {
      console.log("Giro");
      const confirmation = window.confirm("¿Estás seguro de que quieres borrar este producto?");
      console.log(fav_products[currentIndex]);
      if (confirmation) {
        deleteProduct(fav_products[currentIndex].name);
        actionExecuted = true;
        setTimeout(() => {
          actionExecuted = false;
        }, 1000);
      }
    }
  }
});


