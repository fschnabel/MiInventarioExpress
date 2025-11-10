const router = require('express').Router();
const path = require('path');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const { asegurarSesion } = require('../middleware/auth');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const { singleFlexible } = require('../utils/upload');


// Multer (misma config que API)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'_'))
});
const upload = multer({ storage });

// Middleware helper para renderizar con errores
function renderConErrores(req, res, view, data = {}) {
  const result = validationResult(req);
  const errores = result.array().map(e => ({ campo: e.path, mensaje: e.msg }));
  return res.status(400).render(view, {
    ...data,
    errores,
    error: errores.map(e => e.mensaje).join(' • '),
    old: req.body,
    usuario: req.session?.usuario
  });
}

/* ===== Auth views ===== */
router.get('/v/login', (req, res) => {
  if (req.session?.userId) return res.redirect('/v/productos');
  res.render('auth/login', { title: 'Login', usuario: null });
});

// Proceso de login (render style -> redirige)
router.post('/v/login', [
  body('usuario').notEmpty().withMessage('El usuario es obligatorio'),
  body('clave').notEmpty().withMessage('La clave es obligatoria')
], async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return renderConErrores(req, res, 'auth/login', { title: 'Login' });
  }
  const { usuario, clave } = req.body;
  const u = await Usuario.findOne({ usuario });
  if (!u || !(await u.comparar(clave))) {
    return res.status(401).render('auth/login', {
      title: 'Login',
      error: 'Credenciales inválidas',
      old: { usuario },
      usuario: null
    });
  }
  req.session.userId = u._id;
  req.session.usuario = u.usuario;
  res.redirect('/v/productos');
});

router.get('/v/register', (req, res) => {
  if (req.session?.userId) return res.redirect('/v/productos');
  res.render('auth/register', { title: 'Crear Usuario' });
});

router.post('/v/register', [
  body("usuario")
    .trim()
    .notEmpty().withMessage("El usuario es obligatorio")
    .isLength({ min: 3 }).withMessage("Debe tener mínimo 3 caracteres"),

  body("clave")
    .notEmpty().withMessage("La clave es obligatoria")
    .isLength({ min: 6 }).withMessage("Debe tener mínimo 6 caracteres")
], async (req, res) => {

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return renderConErrores(req, res, 'auth/register', { title: 'Crear Usuario' });
  }

  const { usuario, clave } = req.body;

  // Validar si ya existe
  const existe = await Usuario.findOne({ usuario });
  if (existe) {
    return res.status(400).render('auth/register', {
      title: 'Crear Usuario',
      error: 'El usuario ya existe',
      old: req.body
    });
  }

  const nuevo = new Usuario({ usuario, clave });
  await nuevo.save(); // Hashea la contraseña (pre-save)

  res.render('auth/login', {
    title: 'Login',
    success: "Usuario creado correctamente, ahora puedes iniciar sesión"
  });
});

/* ===== Productos views ===== */
router.get('/v/productos', asegurarSesion, async (req, res) => {
  const docs = await Producto.find().lean();

  // 👇 aseguramos que items sea un ARRAY DE OBJETOS
  const items = docs.map(prod => ({
    id: prod._id.toString(),
    nombre: prod.nombre,
    precio: prod.precio,
    descripcion: prod.descripcion,
    imagen: prod.imagen
  }));

  console.log("✅ ITEMS QUE VAN A LA VISTA:");
  console.log(items);
  res.render('productos/lista', {
    title: 'Productos',
    items,
    usuario: req.session.usuario
  });
});

router.get('/v/productos/nuevo', asegurarSesion, (_req, res) => {
  res.render('productos/form', {
    title: 'Nuevo producto',
    item: {},
    usuario: _req.session.usuario
  });
});

// Crear (con validación y re-render en error)
router.post('/v/productos/nuevo',
  asegurarSesion,
  singleFlexible('imagen'),
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('precio').notEmpty().withMessage('El precio es obligatorio')
                  .isFloat({ min: 0 }).withMessage('El precio debe ser válido')
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return renderConErrores(req, res, 'productos/form', {
        title: 'Nuevo producto',
        item: {}
      });
    }
    const { nombre, precio, descripcion } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : '';
    await Producto.create({ nombre, precio, descripcion, imagen });
    res.redirect('/v/productos');
  }
);

// Editar (GET)
router.get('/v/productos/:id/editar', asegurarSesion, async (req, res) => {
  const id = req.params.id;
  const doc = await Producto.findById(id).lean();

  if (!doc) {
    return res.status(404).render('productos/lista', {
      title: 'Productos',
      error: 'Producto no encontrado',
      items: []
    });
  }

  // Normalizar para la vista
  const item = {
    id: doc._id.toString(),
    nombre: doc.nombre ?? '',
    precio: Number(doc.precio ?? 0),
    descripcion: doc.descripcion ?? '',
    imagen: doc.imagen ?? ''
  };

  // Log útil
  console.log('📝 EDIT GET item =>', item);

  res.render('productos/form', {
    title: 'Editar producto',
    item
  });
});

// Editar (POST -> re-render si error)
router.post('/v/productos/:id/editar',
  asegurarSesion,
  async (req, _res, next) => {
    const doc = await Producto.findById(req.params.id).lean();
    req._itemVista = doc ? {
      id: doc._id.toString(),
      nombre: doc.nombre ?? '',
      precio: Number(doc.precio ?? 0),
      descripcion: doc.descripcion ?? '',
      imagen: doc.imagen ?? ''
    } : { id: req.params.id };
    next();
  },
  singleFlexible('imagen'), 
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('precio').notEmpty().withMessage('El precio es obligatorio')
                  .isFloat({ min: 0 }).withMessage('El precio debe ser válido')
  ],
  async (req, res) => {
    const result = validationResult(req);
    const baseData = { title: 'Editar producto', usuario: req.session.usuario };
    if (!result.isEmpty()) {
      const item = await Producto.findById(req.params.id);
      return renderConErrores(req, res, 'productos/form', { ...baseData, item });
    }
    const { nombre, precio, descripcion } = req.body;
    const update = { nombre, precio, descripcion };
    if (req.file) update.imagen = `/uploads/${req.file.filename}`;
    await Producto.findByIdAndUpdate(req.params.id, update);
    res.redirect('/v/productos');
  }
);

// Eliminar (POST)
router.post('/v/productos/:id/eliminar', asegurarSesion, async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.redirect('/v/productos');
});

const ChatMensaje = require('../models/ChatMensaje');

// Vista del chat
router.get('/v/chat', asegurarSesion, (req, res) => {
  res.render('chat', { title: 'Chat' });
});


module.exports = router;
