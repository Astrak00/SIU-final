const socket = io("http://localhost:3000");

const URL = "./ppl/";

let model, webcam, labelContainer;

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  // Get the current screen width and height
  const width_scr = window.innerWidth;
  const height_scr = window.innerHeight;
  const_square = Math.min(width_scr, height_scr) * 0.75;

  const devices = await navigator.mediaDevices.enumerateDevices();

  // Encuentra la camara frontal
  const rearCamera = devices.find((device) => device.kind === "videoinput");

  webcam = new tmImage.Webcam(
    const_square,
    const_square,
    flip,
    rearCamera.deviceId
  );
  let type_webcam = { facingMode: "environment" };
  await webcam.setup(type_webcam); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);
  document.getElementById("webcam-container").appendChild(webcam.canvas);

  async function loop() {
    webcam.update(); // update the webcam frame
    //await predict();
    window.requestAnimationFrame(loop);
  }

  socket.emit("loadFavouritesFromUser", user);
  socket.on("loadFavouritesResult", (data) => {
    // Calculate the total amount to pay
    let total = 0;
    data = data.message;
    console.log(data);
    data.forEach((element) => {
      total += element.price;
    });
    total = total.toFixed(2);
    document.getElementById("capture-btn").innerHTML += ": " + total + "€";
  });
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

// Parse the URL to get the user
const URLSearchParams_ = new URLSearchParams(window.location.search);
const user = URLSearchParams_.get("user");

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  prediction.sort(
    (a, b) => parseFloat(b.probability) - parseFloat(a.probability)
  );
  // Get the confirmation of the prediction
  const confirmation = window.confirm(
    `¿Estás seguro de que quieres pagar con ${prediction[0].className}?`
  );
  if (confirmation) {
    socket.emit("paymentMade", {
      user: user,
      payment: prediction[0].className,
    });
    showModal("Pago realizado con éxito", 0);
  } else {
    showModal("Pago cancelado", 1);
  }
  // Wait 2 seconds to redirect to the main page
  setTimeout(() => {
    window.location.href = `/www`;
  }, 1400);
}

init();

// Comentarios cosas que hacer: Se podrían poner los objetos a comprar, o el total a pagar
// en la pantalla de pago. Se podría hacer un botón para cancelar el pago (volver).
