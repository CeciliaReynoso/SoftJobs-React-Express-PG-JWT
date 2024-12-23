const jwt = require('jsonwebtoken');

const verificarCredencialesMiddleware = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Credenciales incompletas");
  }
  next();
};

const validarTokenMiddleware = (req, res, next) => {
  const Authorization = req.header("Authorization");
  if (!Authorization) {
    return res.status(401).send("Token no proporcionado");
  }
  const token = Authorization.split("Bearer ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.email = jwt.decode(token).email;
    next();
  } catch (error) {
    res.status(401).send("Token inválido");
  }
};

const reportarConsultasMiddleware = (req, res, next) => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString();
        const formattedTime = now.toLocaleTimeString();
        const url = req.url;
    
        res.on('finish', () => {
            const statusCode = res.statusCode;
            console.log(`
            ${formattedDate} - ${formattedTime} - ${req.method} ${req.url} - ${statusCode}
            `);
        });
    
        next();
    };


module.exports = { verificarCredencialesMiddleware, validarTokenMiddleware, reportarConsultasMiddleware };
