/*
document.addEventListener('DOMContentLoaded', function() {
    const addProductForm = document.getElementById('addProductForm');
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalAmount');

    let totalAmount = 0;

    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const productName = document.getElementById('productName').value;
        const productPrice = parseFloat(document.getElementById('productPrice').value);

        if (!productName || !productPrice || isNaN(productPrice)) {
            alert('Por favor, complete todos los campos con valores válidos.');
            return;
        }

        // Añadir producto al carrito
        const newItem = document.createElement('li');
        newItem.textContent = `${productName}: $${productPrice.toFixed(2)}`;
        cartItems.appendChild(newItem);

        // Actualizar total
        totalAmount += productPrice;
        totalPrice.textContent = totalAmount.toFixed(2);

        // Limpiar formulario
        addProductForm.reset();
    });
});
*/ 
let cartItems = [];
let cartTotal = 0;

async function get_id() {
    try {
        const response = await fetch('http://localhost:3000/agenda/counter');
        const data = await response.text();
        const id = parseInt(data);
        return id+1;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Lanzar el error para que sea manejado por la función que llama a get_id()
    }
}


async function addToCart(productName, price) {
    let id = await get_id();
    // haciendo una solicitud POST al servidor
    fetch('http://localhost:3000/agenda', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id, productName, price}),
    })
    .catch(error => showModal(error, 1));
    //cartItems.push({ productName, price });
    //cartTotal += price;
    updateCart();
}




function updateCart() {
    fetch('http://localhost:3000/agenda')
    .then(response => response.json())
    .then(data => {
        renderContacts(data);
    })
    .catch(error => showModal(error, 1));
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
