const Usuario = require('../models/usuario');
const CryptoJS = require('crypto-js');
const mongoose = require('mongoose');

//crea usuario
const creaUsuario = async(req, res) => {
    
    try {
        const { email, password } = req.body;

        const existeUsuario = await Usuario.findOne({email});
        if(existeUsuario){
            return res.status(400).json({msg: 'El usuario ya existe'});
        }

        //cifro pass
        const passwordCifrado = CryptoJS.AES.encrypt(
            password,
            process.env.PASS_SEC
        ).toString();

        //creo usuario
        const nuevoUsuario = new Usuario({
            email,
            password: passwordCifrado
        });
        await nuevoUsuario.save();
        res.json({msg: 'Usuario creado'});
    } catch (error) {
        console.log(error);
    }
}

//trae usuarios
const getUsuarios = async(req, res) => { 
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        console.log(error);
    }
}

//trae usuario por ID
const getUsuarioPorId = async (req, res) => {
    const { _id } = req.params; 
    try {
        const usuario = await Usuario.findById(_id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        //mando el email PERO no el pass
        const { email, role } = usuario;
        const dataUsuario = { 
            email,
            role
        };
        res.status(200).json(dataUsuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};

//modifica usuario
const modificaUsuario = async (req, res) => {
    try {
        const { _id } = req.params; // Obtiene el ObjectId de los parámetros de la solicitud
        const { email, password } = req.body;

        let passwordCifrado;

        // Verifica si el _id es válido
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ msg: 'ID no válido' });
        }

        // Busca el usuario por _id
        const existeUsuario = await Usuario.findById(_id);
        if (!existeUsuario) {
            return res.status(404).json({ msg: 'El usuario no existe' });
        }

        // Cifra la contraseña si se proporciona
        if (password) {
            passwordCifrado = CryptoJS.AES.encrypt(
                password,
                process.env.SECRET_KEY
            ).toString();
        }

        // Prepara los datos actualizados
        const newData = {
            email: email || existeUsuario.email,
            password: passwordCifrado || existeUsuario.password,
        };

        // Actualiza el usuario por _id
        await Usuario.findByIdAndUpdate(_id, newData, { new: true });

        res.json({ msg: 'Usuario modificado' });
    } catch (error) {
        console.error("Error al modificar usuario:", error);
        res.status(500).json({ msg: 'Error del servidor', error });
    }
};

//elimina usuario
const eliminaUsuario = async(req, res) => {
    try {
        const { email } = req.body;
        await Usuario.findOneAndDelete({email});
        res.json({msg: 'Usuario eliminado'});
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = {
    creaUsuario,
    getUsuarios,
    getUsuarioPorId,
    modificaUsuario,
    eliminaUsuario
}