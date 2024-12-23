const {
  obtenerUsuarios,
  modificarUsuario,
  eliminarUsuario,
  obtenerUsuarioPorId,
  obtenerUsuarioPorEmail,
  verificarCredenciales,
  registrarUsuario
} = require("../models/consultas");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const getUsuarios = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    const { email } = jwt.decode(token);
    const usuario = await obtenerUsuarioPorEmail(email);
    res.json([usuario]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await obtenerUsuarioPorId(id);
    res.json(usuario);
  } catch (error) {
    res.status(error.code).send(error.message);
  }
};

const postUsuario = async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body;
    await registrarUsuario({ email, password, rol, lenguage });
    res.send("Usuario creado con éxito");
  } catch (error) {
    res.status(500).send(error.message);
  }
};



const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await verificarCredenciales(email, password);
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).send("Email o contraseña incorrecta");
    }
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: 60 });
    res.send({ token });
  } catch (error) {
    res.status(error.code || 500).send(error.message);
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarUsuario(id);
    res.send(`El usuario con id ${id} ha sido eliminado`);
  } catch (error) {
    res.status(error.code).send(error.message);
  }
};

const putUsuario = async (req, res) => {
  try {
    let { password, rol, lenguage } = req.body;
    const { id } = req.params;

    if (password) {
      password = bcrypt.hashSync(password, 10);
    }

    const usuarioModificado = await modificarUsuario(id, req.email, password, rol, lenguage);
    res.send(`El usuario ${req.email} ha modificado datos del usuario con id ${id}`);
  } catch (error) {
    res.status(error.code || 500).send(error.message || "Error interno del servidor");
  }
};

module.exports = { getUsuarios, getUsuarioPorId, postUsuario, postLogin, deleteUsuario, putUsuario };
