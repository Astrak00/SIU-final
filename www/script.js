function send_to_cart(){
  
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

