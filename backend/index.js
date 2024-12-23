const express = require("express");
const cors = require("cors");
const app = express();
const usuariosRoutes = require("./routes/usuariosRoutes");

app.use(express.json());
app.use(cors());

app.use("/", usuariosRoutes);

app.listen(3000, console.log("¡Servidor encendido!"));
