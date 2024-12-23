const { DB } = require("../config/db");
const bcrypt = require('bcryptjs');

const obtenerUsuarios = async () => {
  const { rows } = await DB.query("SELECT * FROM usuarios");
  return rows;
};

const modificarUsuario = async (id, email, passwordEncriptada, rol, lenguage) => {
  const consulta = "UPDATE usuarios SET email = $1, passwordEncriptada = $2, rol = $3, lenguage = $4 WHERE id = $5 RETURNING *";
  const values = [email, passwordEncriptada, rol, lenguage, id];
  const result = await DB.query(consulta, values);
  if (result.rowCount === 0) {
    throw { code: 404, message: "No se consiguió ningún usuario con este id" };
  }
  return result.rows[0];
};

const eliminarUsuario = async (id) => {
  const result = await DB.query("DELETE FROM usuarios WHERE id = $1", [id]);
  if (result.rowCount === 0) {
    throw { code: 404, message: "No se consiguió ningún usuario con este id" };
  }
};

const obtenerUsuarioPorId = async (id) => {
  const result = await DB.query("SELECT * FROM usuarios WHERE id = $1", [id]);
  if (result.rowCount === 0) {
    throw { code: 404, message: "No se consiguió ningún usuario con este id" };
  }
  return result.rows[0];
};

const obtenerUsuarioPorEmail = async (email) => {
  const result = await DB.query("SELECT * FROM usuarios WHERE email = $1", [email]);
  if (result.rowCount === 0) {
    throw { code: 404, message: "No se consiguió ningún usuario con este email" };
  }
  return result.rows[0];
};

const verificarCredenciales = async (email, password) => {
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const { rows: [usuario], rowCount } = await DB.query(consulta, [email]);
  if (!rowCount || !bcrypt.compareSync(password, usuario.password)) {
    throw { code: 401, message: "Email o contraseña incorrecta" };
  }
  return usuario;
};

const registrarUsuario = async (user) => {
  const { email, password, rol, lenguage } = user;
  const passwordEncriptada = bcrypt.hashSync(password, 10);
  const consulta = "INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)";
  await DB.query(consulta, [email, passwordEncriptada, rol, lenguage]);
};

module.exports = { obtenerUsuarios, modificarUsuario, eliminarUsuario, obtenerUsuarioPorId, obtenerUsuarioPorEmail, verificarCredenciales, registrarUsuario };
