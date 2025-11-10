const router = require("express").Router();
const { body } = require("express-validator");
const multer = require("multer");
const ctl = require("../controllers/producto.controlador");
const { asegurarSesion } = require("../middleware/auth");
const validarCampos = require("../middleware/validarCampos");
const { singleFlexible } = require('../utils/upload');

console.log('[RPD.ROUTES] ctl keys:', Object.keys(ctl));
console.log('[PRD.ROUTES] typeof validarCampos:', typeof validarCampos);

// Config de multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"))
});

const upload = multer({ storage });

// Obtener productos
router.get("/", asegurarSesion, ctl.listar);

// Crear producto
router.post(
  "/",
  asegurarSesion,
  singleFlexible('imagen'),
  upload.single("imagen"),
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("precio")
      .notEmpty().withMessage("El precio es obligatorio")
      .isFloat({ min: 0 }).withMessage("El precio debe ser válido"),
    validarCampos
  ],
  ctl.crear
);

// Actualizar producto
router.put(
  "/:id",
  asegurarSesion,
  upload.single("imagen"),
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("precio")
      .notEmpty().withMessage("El precio es obligatorio")
      .isFloat({ min: 0 }).withMessage("El precio debe ser válido"),
    validarCampos
  ],
  ctl.actualizar
);

router.delete("/:id", asegurarSesion, ctl.eliminar);

module.exports = router;
