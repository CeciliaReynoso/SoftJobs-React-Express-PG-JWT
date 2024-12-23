const express = require("express");
const router = express.Router();
const {
  getUsuarios,
  getUsuarioPorId,
  postUsuario,
  postLogin,
  deleteUsuario,
  putUsuario
} = require("../controllers/usuariosController");
const { verificarCredencialesMiddleware, validarTokenMiddleware, reportarConsultasMiddleware } = require("../middlewares/middlewares");

router.use(reportarConsultasMiddleware);

router.get("/usuarios", validarTokenMiddleware, getUsuarios);
router.get("/usuarios/:id", validarTokenMiddleware, getUsuarioPorId);
router.post("/usuarios", verificarCredencialesMiddleware, postUsuario);
router.post("/login", verificarCredencialesMiddleware, postLogin);
router.delete("/usuarios/:id", validarTokenMiddleware, deleteUsuario);
router.put("/usuarios/:id", validarTokenMiddleware, putUsuario);

module.exports = router;
