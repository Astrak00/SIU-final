const socket = io("http://localhost:3000");
const mymap = L.map('sample_map').setView([40.741, -3.884], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18
}).addTo(mymap);
let tiendas= [];
var marca;
var cordenadas = null;
var inicio=true;



function pedir_tiendas(){
  socket.emit("request_stores");
}

socket.on("request_stores_result", (data) => {
  tiendas= data;
  console.log("Tiendas recibidas");
  tiendas.forEach(function(tienda) {
  L.marker([tienda.coordenadas[0], tienda.coordenadas[1]]).addTo(mymap);
  var tiempo = setInterval(function() {
    navigator.geolocation.getCurrentPosition(success, error);
  }, 1000);
  
  

  });
  
});
pedir_tiendas();
//Añadir un marcador por tienda



// Cuando funcione el geolocalizador ejecutará la siguiente función
function success(pos) {
  const crd = pos.coords;
  //Para que solo centre la camara una vez
  if (inicio){
    mymap.setView([crd.latitude, crd.longitude], 15);
    console.log(crd.latitude, crd.longitude);
    inicio=false;

  }
  if (marca){
    mymap.removeLayer(marca);
  }
  marca=L.marker([crd.latitude, crd.longitude]).addTo(mymap);
  var cercana;
  var min=1000000;
  tiendas.forEach(function(tienda) {
    var distancia = Math.sqrt(Math.pow(crd.latitude - tienda.coordenadas[0], 2) + Math.pow(crd.longitude - tienda.coordenadas[1], 2));
    if (distancia < min) {
      min = distancia;
      cercana = tienda;
    }
  });
   
}
//En caso de no funcionar el geolocalizador
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`); 
}



