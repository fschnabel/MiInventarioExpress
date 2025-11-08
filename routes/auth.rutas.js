const router = require('express').Router();
const ctl = require('../controllers/auth.controlador');

router.post('/login',  ctl.login);
router.post('/logout', ctl.logout);
router.get('/me',      ctl.me);

module.exports = router;
