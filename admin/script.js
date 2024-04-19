const fs = require("fs");

let xValues = [];
let yValues = [];
let barColors = ["red", "green", "blue", "orange", "brown"]; // Remove * 2

// Read the content from the file products.json:
fs.readFile("products.json", "utf8", function (err, data) {
  if (err) {
    console.log(err);
  } else {
    const products = JSON.parse(data);
    products.forEach((product) => {
      console.log(product);
      xValues.push(product.nombre);
      yValues.push(product.cantidad);
    });

    // After reading the file and populating the arrays, create the chart
    createChart();
  }
});

var sic = document.getElementById("myChart");

function createChart() {
  new Chart(sic, {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [
        {
          backgroundColor: barColors,
          data: yValues,
        },
      ],
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: "Quantity of products left in inventory",
      },
    },
  });
}
