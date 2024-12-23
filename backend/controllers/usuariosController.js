const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  obtenerUsuarios,
  modificarUsuario,
  eliminarUsuario,
  obtenerUsuarioPorId,
  obtenerUsuarioPorEmail,
  verificarCredenciales,
  registrarUsuario
} = require("../models/consultas");

const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await verificarCredenciales(email, password);
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).send("Email o contraseña incorrecta");
    }
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
    res.send({ token });
  } catch (error) {
    next(error);
  }
};

const getUsuarios = async (req, res, next) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    const { email } = jwt.decode(token);
    const usuario = await obtenerUsuarioPorEmail(email);
    res.json([usuario]);
  } catch (error) {
    next(error);
  }
};

const getUsuarioPorId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const usuario = await obtenerUsuarioPorId(id);
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

const postUsuario = async (req, res, next) => {
  try {
    const { email, password, rol, lenguage } = req.body;
    await registrarUsuario({ email, password, rol, lenguage });
    res.send("Usuario creado con éxito");
  } catch (error) {
    next(error);
  }
};

const deleteUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    await eliminarUsuario(id);
    res.send(`El usuario con id ${id} ha sido eliminado`);
  } catch (error) {
    next(error);
  }
};

const putUsuario = async (req, res, next) => {
  try {
    let { password, rol, lenguage } = req.body;
    const { id } = req.params;

    if (password) {
      password = bcrypt.hashSync(password, 10);
    }

    const usuarioModificado = await modificarUsuario(id, req.email, password, rol, lenguage);
    res.send(`El usuario ${req.email} ha modificado el evento de id ${id}`);
  } catch (error) {
    next(error);
  }
};

module.exports = { postLogin, getUsuarios, getUsuarioPorId, postUsuario, deleteUsuario, putUsuario };
