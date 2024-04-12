let cartItems = [];
let cartTotal = 0;

function addToCart(productName, price) {
  cartItems.push({ productName, price });
  cartTotal += price;
  updateCart();
}

function updateCart() {
  let cartItemsHTML = "";
  cartItems.forEach((item) => {
    cartItemsHTML += `<p>${item.productName} - $${item.price}</p>`;
  });
  document.getElementById("cart-items").innerHTML = cartItemsHTML;
  document.getElementById("cart-total").innerText = cartTotal;
}

function checkout() {
  alert("¡Gracias por su compra!");
  cartItems = [];
  cartTotal = 0;
  updateCart();
}

function changeProductSelection(product_id) {
  all_products = document.getElementsByClassName("product");
  for (let i = 0; i < all_products.length; i++) {
    all_products[i].classList.remove("selected");
  }
  prod = document.getElementById("product" + product_id);
  console.log(prod);
  prod.classList.add("selected");
}

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

