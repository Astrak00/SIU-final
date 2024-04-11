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
