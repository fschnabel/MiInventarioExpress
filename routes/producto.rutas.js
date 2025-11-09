const router = require('express').Router();
const { asegurarSesion } = require('../middleware/auth');
const multer = require('multer');
const ctl = require('../controllers/producto.controlador');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'_'))
});
const fileFilter = (_req, file, cb) => {
  const ok = ['image/jpeg','image/png','image/webp','image/gif'].includes(file.mimetype);
  cb(ok ? null : new Error('Tipo de imagen no permitido'), ok);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 2*1024*1024 } });

router.get('/', asegurarSesion, ctl.listar);
router.post('/', asegurarSesion, upload.single('imagen'), ctl.crear);
router.put('/:id', asegurarSesion, upload.single('imagen'), ctl.actualizar);
router.delete('/:id', asegurarSesion, ctl.eliminar);

module.exports = router;
