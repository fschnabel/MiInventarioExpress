// utils/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.parse(file.originalname).name.replace(/[^\w.-]+/g, '_').toLowerCase();
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

const ALLOWED = new Set(['image/jpeg','image/png','image/webp','image/gif']);
function fileFilter(_req, file, cb) {
  if (!ALLOWED.has(file.mimetype)) return cb(new Error('TIPO_INVALIDO'), false);
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// 👇 Si no es multipart, no ejecutes multer (evita "Unexpected end of form")
function singleFlexible(fieldName) {
  return (req, res, next) => {
    const ct = req.headers['content-type'] || '';
    if (!ct.startsWith('multipart/form-data')) return next();
    upload.single(fieldName)(req, res, next);
  };
}

module.exports = { upload, singleFlexible };
