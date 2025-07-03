const express = require("express");
const routes = require("./routes.js");

const app = express();

// CORS para todas las rutas
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET"); // no estan siendo usadas POST, PUT, DELETE, OPTIONS
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  next();
});

app.use(express.json());
app.use(routes);

module.exports = app;
