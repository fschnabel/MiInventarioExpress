const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  console.log("LOGIN solicitado");

  const { usuario, clave } = req.body;
bcrypt.hash('admin123', 10).then(h => console.log(h));
  console.log("Datos recibidos:", { usuario, clave });

  if (!usuario || !clave) {
    console.log("Faltan datos");
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const u = await Usuario.findOne({ usuario });

  console.log("Resultado en Mongo:", u);

  if (!u) {
    console.log("Usuario no existe en BD");
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  
  const coincide = await bcrypt.compare(clave, u.clave); 

  console.log("¿Clave correcta?:", coincide);

  if (!coincide) {
    console.log("Contraseña incorrecta");
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  req.session.userId = u._id;
  req.session.usuario = u.usuario;

  console.log("Login exitoso");
  res.json({ ok: true, usuario: u.usuario });
};


exports.logout = (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
};

exports.me = (req, res) => {
  res.json({ usuario: req.session?.usuario || null });
};
