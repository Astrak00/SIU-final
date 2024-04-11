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
