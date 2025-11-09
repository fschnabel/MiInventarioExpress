const Usuario = require('../models/Usuario');

function sendError(res, status, message, extra = {}) {
  return res.status(status).json({ ok: false, error: message, ...extra });
}

exports.registrar = async (req, res) => {
  try {
    const { usuario, clave } = req.body;
    if (!usuario || !clave) return sendError(res, 400, 'usuario y clave son requeridos');

    const existe = await Usuario.findOne({ usuario });
    if (existe) return sendError(res, 409, 'El usuario ya existe');

    const nuevo = new Usuario({ usuario, clave });
    await nuevo.save(); // pre('save') cifra la clave
    return res.status(201).json({ ok: true, usuario: nuevo.usuario });
  } catch (err) {
    console.error('REGISTRAR error:', err);
    return sendError(res, 500, 'Error al registrar usuario');
  }
};

exports.login = async (req, res) => {
  try {
    const { usuario, clave } = req.body;
    if (!usuario || !clave) return sendError(res, 400, 'usuario y clave son requeridos');

    const u = await Usuario.findOne({ usuario });
    if (!u) return sendError(res, 401, 'Credenciales inválidas');

    const ok = await u.comparar(clave);
    if (!ok) return sendError(res, 401, 'Credenciales inválidas');

    req.session.userId = u._id;
    req.session.usuario = u.usuario;
    return res.json({ ok: true, usuario: u.usuario });
  } catch (err) {
    console.error('LOGIN error:', err);
    return sendError(res, 500, 'Error en login');
  }
};

exports.logout = (req, res) => {
  try {
    req.session.destroy(() => res.json({ ok: true }));
  } catch (err) {
    console.error('LOGOUT error:', err);
    return sendError(res, 500, 'Error en logout');
  }
};

exports.me = (req, res) => {
  try {
    return res.json({ ok: true, usuario: req.session?.usuario || null });
  } catch (err) {
    console.error('ME error:', err);
    return sendError(res, 500, 'Error al consultar sesión');
  }
};
