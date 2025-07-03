// Algunas variables deberian estar en un archivo env solamente, pero el challenge exige el funcionamiento sin .env
const config = {
  EXTERNAL_API_BASE:
    process.env.EXTERNAL_API_BASE || "https://echo-serv.tbxnet.com",
  API_KEY: process.env.API_KEY || "Bearer aSuperSecretKey",
  PORT: process.env.PORT || 3000,
};

module.exports = { config };
