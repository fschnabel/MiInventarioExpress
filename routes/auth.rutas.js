const router = require("express").Router();
const { body } = require("express-validator");
const ctl = require("../controllers/auth.controlador");
const validarCampos = require("../middleware/validarCampos");

console.log('[AUTH.ROUTES] ctl keys:', Object.keys(ctl));
console.log('[AUTH.ROUTES] typeof validarCampos:', typeof validarCampos);

// POST /login
router.post(
  "/login",
  [
    body("usuario").notEmpty().withMessage("El usuario es obligatorio"),
    body("clave").notEmpty().withMessage("La clave es obligatoria"),
    validarCampos
  ],
  ctl.login
);

// POST /registrar
router.post(
  "/registrar",
  [
    body("usuario")
      .notEmpty().withMessage("El usuario es obligatorio")
      .isLength({ min: 3 }).withMessage("El usuario debe tener mínimo 3 caracteres"),

    body("clave")
      .notEmpty().withMessage("La clave es obligatoria")
      .isLength({ min: 6 }).withMessage("La clave debe tener mínimo 6 caracteres"),

    validarCampos
  ],
  ctl.registrar
);

router.post("/logout", ctl.logout);
router.get("/me", ctl.me);

module.exports = router;
