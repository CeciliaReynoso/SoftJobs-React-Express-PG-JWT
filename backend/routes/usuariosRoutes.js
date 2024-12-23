const express = require("express");
const router = express.Router();
const {
  postLogin,
  logout,
  getUsuarios,
  getUsuarioPorId,
  postUsuario,
  deleteUsuario,
  putUsuario
} = require("../controllers/usuariosController");
const { verificarCredencialesMiddleware, validarTokenMiddleware, reportarConsultasMiddleware } = require("../middlewares/middlewares");

router.use(reportarConsultasMiddleware);

router.post("/login", verificarCredencialesMiddleware, postLogin);
router.post("/logout", validarTokenMiddleware, logout);
router.get("/usuarios", validarTokenMiddleware, getUsuarios);
router.get("/usuarios/:id", validarTokenMiddleware, getUsuarioPorId);
router.post("/usuarios", verificarCredencialesMiddleware, postUsuario);
router.delete("/usuarios/:id", validarTokenMiddleware, deleteUsuario);
router.put("/usuarios/:id", validarTokenMiddleware, putUsuario);

module.exports = router;
