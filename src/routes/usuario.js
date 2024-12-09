const express = require('express');
const { creaUsuario, getUsuarios, getUsuarioPorId, modificaUsuario, eliminaUsuario } = require('../controllers/usuario');

const router = express.Router();

//rutas

//trae usuarios
router.get('/', getUsuarios);

//trae usuario por ID
router.get('/:_id', getUsuarioPorId);

//crea usuario
router.post('/crea', creaUsuario);

//modifica usuario
router.put('/edita/:_id', modificaUsuario);

//elimina usuario
router.delete('/elimina', eliminaUsuario);

module.exports = router;