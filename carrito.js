


var product_list = [];
function renderlist (list){
    let p_list = document.getElementsByClassName('products');
    //var myArray = JSON.parse(myJSON);
    // Nombre, precio, src, descripcion
    /*<img src="product2.jpg" alt="Product 2" />
          <h2>Producto 2</h2>
          <p>Precio: $15</p>
          <button onclick="addToCart('Product 2', 15)">
          */
    data.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product selected');

        const img_product = document.createElement('img');
        img_product.src= `${product.id}`;
        img_product.alt= `${product.name}`;

        const name_product = document.createElement('h2');
        name_product.textContent= `${product.name}`;

        const price_product = document.createElement('p');
        price_product.textContent= `${product.price}`;

        const button_product = document.createElement('button');
        button_product.onclick=`addToCart(${product.name}, ${product.price})`;
 

        const descriptionHolder = document.createElement('span');
        descriptionHolder.textContent = `Descripción:`;
        const descriptionElement = document.createElement('span');
        descriptionElement.textContent = `${contact.description}\n`;

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

function load_products(){ 
  fetch('http://localhost:3333/tienda')
        .then(response => response.json())
        .then(data => {
            renderlist(data);
        })
        .catch(error => showModal(error, 1));
        
}


const textInput = document.getElementById('textInput');
const speakButton = document.getElementById('speakButton');

speakButton.addEventListener('click', () => {
  const textToSpeak = textInput.value;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  speechSynthesis.speak(utterance);
});