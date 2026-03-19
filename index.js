const express = require("express");

const app = express();

// rota teste
app.get("/", (req, res) => {
  res.send("API funcionando 🚀, Hello World");
});

// subir servidor
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});