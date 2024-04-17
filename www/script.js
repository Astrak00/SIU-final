
// En el archivo JavaScript del cliente
const socket = io('http://localhost:3000');

socket.on('products', (data) => {
    renderlist(data);
});

socket.on('loginResult', function(result) {
  if (result.success) {
    showModal('Inicio de sesión exitoso', 0);
  } else {
    // Inicio de sesión fallido, mostrar mensaje de error
    showModal(result.message, 1);
  }
});

socket.on('addProductResult', function(result) {
  if (result.success) {
    showModal(result.message, 0);
  } else {
    // Inicio de sesión fallido, mostrar mensaje de error
    showModal(result.message, 1);
  }
});

socket.on('loadFavouritesResult', (data) => {
    load_carrito(data);
});


// Función para agregar un producto
function addProduct(event, newProduct) {
  event.preventDefault();
  socket.emit('addProduct', newProduct);
}

function showCart() {
  const cart_page = document.getElementById('carro');
  const main_page = document.getElementById('main_page');
  if (cart_page.style.display == 'none') {
    cart_page.style.display = 'block';
    main_page.style.display = 'none';
  } else {
    cart_page.style.display = 'none';
    main_page.style.display = 'block';
  }
  socket.emit('loadFavourites');
}

// Función para eliminar un producto
function deleteProduct(productId) {
    socket.emit('deleteProduct', productId);
}


function showModal(message, err) {
  const modal = document.getElementById('error-modal');
  const errorMessageElement = document.getElementById('error-message');
  const box = document.getElementById('modal-content');
  if (err == 1){
      box.style.backgroundColor = "lightcoral";
  }
  else{
      box.style.backgroundColor = "lightgreen";
  }
  errorMessageElement.textContent = message;
  modal.style.display = 'block';
}
// Cerrar la caja de confirmaciones/errores
function closeModal() {
  const modal = document.getElementById('error-modal');
  modal.style.display = 'none';
}

var product_list = [];

function renderlist (data){
    const p_list = document.getElementById('products');
    p_list.textContent = "";
    //var myArray = JSON.parse(myJSON);
    // Nombre, precio, src, descripcion
    /*<img src="product2.jpg" alt="Product 2" />
          <h2>Producto 2</h2>
          <p>Precio: $15</p>
          <button onclick="addToCart('Product 2', 15)">
          */
    data.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        const img_product = document.createElement('img');
        img_product.src= `${product.imagen}`;
        img_product.alt= `${product.nombre}`;

        const name_product = document.createElement('h2');
        name_product.textContent= `${product.nombre}`;

        const price_product = document.createElement('p');
        price_product.textContent= `${product.precio}`;

        const button_product = document.createElement('button');
        button_product.onclick = (event) => {
          console.log('Botón clickeado');
          addProduct(event, { name: product.nombre, price: product.precio });
        };
        
        button_product.classList.add('but');
        button_product.textContent = "Añadir al carrito";
 

        const descriptionHolder = document.createElement('span');
        descriptionHolder.textContent = `Descripción:`;
        const descriptionElement = document.createElement('span');
        descriptionElement.textContent = `${product.descripcion}\n`;

        // Agregar los elementos span al elemento de contacto
        productElement.appendChild(img_product);
        productElement.appendChild(name_product);
        productElement.appendChild(price_product);
        productElement.appendChild(descriptionHolder);

        productElement.appendChild(descriptionElement);
        productElement.appendChild(button_product);

        // Agregar el elemento de contacto al elemento de lista de contactos
        p_list.appendChild(productElement);
    });


}

function load_carrito(data){
  const f_list = document.getElementById('cart-items');
  const total = document.getElementById('totalAmount');  
  f_list.textContent = "";
  let amount = 0;
  data.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('product');
      /*
      const img_product = document.createElement('img');
      img_product.src= `${product.imagen}`;
      img_product.alt= `${product.nombre}`;
      */
      const name_product = document.createElement('h2');
      name_product.textContent= `${product.name}`;

      const price_product = document.createElement('p');
      price_product.textContent= `${product.price}`;


      // Agregar los elementos span al elemento de contacto
      //productElement.appendChild(img_product);
      productElement.appendChild(name_product);
      productElement.appendChild(price_product);

      // Agregar el elemento de contacto al elemento de lista de contactos
      f_list.appendChild(productElement);
      amount += parseFloat(product.price);
  });
  total.textContent = amount;
}





const textInput = document.getElementById('textInput');
const speakButton = document.getElementById('speakButton');

speakButton.addEventListener('click', () => {
  const textToSpeak = textInput.value;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  speechSynthesis.speak(utterance);
});



function actulizarFiltroCategorias() {
  var categoriaSelect = document.getElementById('filtro-categoria');
  var unicasCategorias = {};
  var productos = document.querySelectorAll('.product');
  productos.forEach(function(product) {
    var categoria = product.dataset.categoria;
    unicasCategorias[categoria] = true;
  });

  categoriaSelect.innerHTML = '';
  // Añadimos 'Todos' como la opcion por defecto
  var defaultOption = document.createElement('option');
  defaultOption.value = '0';
  defaultOption.textContent = 'Todos';
  categoriaSelect.appendChild(defaultOption);
  // Añadimos las otras categorias encontradas
  Object.keys(unicasCategorias).forEach(function(category) {
    var option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoriaSelect.appendChild(option);
  });
}

actulizarFiltroCategorias();

function filterProducts() {
  var categoriaSelect = document.getElementById('filtro-categoria');
  var seleccionCategoria = categoriaSelect.value;
  var products = document.querySelectorAll('.product');
  products.forEach(function(product) {
    var categoria = product.dataset.categoria;
    if (seleccionCategoria === '0' || seleccionCategoria === categoria) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}


document.getElementById('filtro-categoria').addEventListener('change', filterProducts);


document.getElementById('loginIcon').addEventListener('click', function() {
  console.log("HERE");
  const loginFormContainer = document.getElementById('loginFormContainer');
  if (loginFormContainer.style.display == 'none') {
    loginFormContainer.style.display = 'block';
  } else {
    loginFormContainer.style.display = 'none';
  }
});

// Manejar el envío del formulario de inicio de sesión
function Submitform(){
  event.preventDefault();
  const username = document.getElementById('username').value.toString();
  const password = document.getElementById('password').value.toString();
  // Enviar los datos de inicio de sesión al servidor a través de sockets
  socket.emit('login', { username, password });
};


