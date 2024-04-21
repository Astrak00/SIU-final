const socket = io("http://localhost:3000");

function mostrarCuestionario() {
  var formulario = document.getElementById("añadir_producto");
  formulario.style.display = "block";
}

function ocultarCuestionario() {
  var formulario = document.getElementById("añadir_producto");
  formulario.style.display = "none";
}

function mostrarTiendas() {
  var formulario = document.getElementById("añadir_tienda");
  formulario.style.display = "block";
}

function ocultarTiendas() {
  var formulario = document.getElementById("añadir_tienda");
  formulario.style.display = "none";
}

function sendResponse(jsonData) {
  socket.emit("newProduct", jsonData);
}

function enviarRespuestasProducto(event) {
  console.log("Enviando respuestas");
  event.preventDefault(); // Prevenir el envío del formulario por defecto

  // Recuperar los valores del formulario
  const producto = {
    nombre: document.getElementById("nombre").value,
    precio: document.getElementById("precio").value,
    imagen: document.getElementById("enlace").value,
    cantidad: document.getElementById("cantidad").value,
    categoria: document.getElementById("categoria").value,
    descripcion: document.getElementById("descripcion").value,
  };
  console.log("Producto añadido", producto);
  const jsonData = JSON.stringify(producto);
  sendResponse(jsonData);
}

function enviarRespuestasTienda(event) {
  console.log("Enviando respuestas");
  event.preventDefault(); // Prevenir el envío del formulario por defecto

  // Recuperar los valores del formulario
  const producto = {
    lugar: document.getElementById("lugar").value,
    coordenadas: [
      document.getElementById("coordenada x").value,
      document.getElementById("coordenada y").value,
    ],
    src: document.getElementById("enlace_tienda").value,
  };
  console.log("Producto añadido", producto);
  const jsonData = JSON.stringify(producto);
  sendResponse(jsonData);
}

function closeModal() {
  const modal = document.getElementById("error-modal");
  modal.style.display = "none";
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

// Escuchar la respuesta del servidor
socket.on("productAdded", (data) => {
  console.log("Respuesta del servidor", data);
  if (data.success) {
    showModal("Producto añadido con éxito", 0);
  } else {
    showModal("Error al añadir el producto", 1);
  }
});
