const fs = require('fs');

function mostrarCuestionario() {
  
    var formulario = document.getElementById('añadir_producto');
    formulario.style.display = 'block'; // Mostrar el formulario cuando se hace clic en el botón
  }
function ocultarCuestionario() {

  var formulario = document.getElementById('añadir_producto');
  formulario.style.display = 'none'; // Mostrar el formulario cuando se hace clic en el botón
}
  
  function enviarRespuestas(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto
  
    // Recuperar los valores del formulario
    const producto = {
      "nombre": document.getElementById('nombre').value,
      "precio": document.getElementById('precio').value,
      "imagen": document.getElementById('enlace').value,
      "cantidad": document.getElementById('cantidad').value,
      "categoria": document.getElementById('categoria').value,
      "descripcion": document.getElementById('descripcion').value
  };
  const jsonData = JSON.stringify(producto);
  fs.writeFile('products.json', jsonData, (err) => {
    if (err) {
        console.error('Error al escribir en el archivo:', err);
        return;
    }
    console.log('El archivo "products.json" ha sido creado correctamente.');
});


  }
 