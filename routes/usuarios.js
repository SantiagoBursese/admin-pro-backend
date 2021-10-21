// Ruta: /api/usuarios


const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')

const { getUsuarios, crearUsuarios, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validatJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validatJWT, getUsuarios);

router.post('/', [
        validatJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos
    ],
    crearUsuarios);

router.put('/:id', [
    validatJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('role', 'El role es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos,

], actualizarUsuario)

router.delete('/:id', validatJWT, borrarUsuario)

module.exports = router;