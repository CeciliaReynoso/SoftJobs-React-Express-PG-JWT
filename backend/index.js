const express = require("express");
const cors = require("cors");
const app = express();
const usuariosRoutes = require("./routes/usuariosRoutes");
const { manejarErroresMiddleware } = require("./middlewares/middlewares");

app.use(express.json());
app.use(cors());

app.use("/", usuariosRoutes);

// Middleware de manejo de errores
app.use(manejarErroresMiddleware);

app.listen(3000, console.log("¡Servidor encendido!"));
