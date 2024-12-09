const express = require('express');
const { creaUsuario, getUsuarios, modificaUsuario, eliminaUsuario } = require('../controllers/usuario');

const router = express.Router();

//rutas

//trae usuarios
router.get('/', getUsuarios);

//crea usuario
router.post('/crea', creaUsuario);

//modifica usuario
router.put('/edita/:_id', modificaUsuario);

//elimina usuario
router.delete('/elimina/:_id', eliminaUsuario);

module.exports = router;