const Usuario = require('../models/usuario');
const CryptoJS = require('crypto-js');

//crea usuario
const creaUsuario = async(req, res) => { console.log(req.body);
    
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

//modifica usuario
const modificaUsuario = async(req, res) => {
    try {
        const { email, password } = req.body;
        const passwordCifrado = CryptoJS.AES.encrypt(
            password,
            process.env.SECRET_KEY
        ).toString();
        await Usuario.findOneAndUpdate(
            {email},
            {password: passwordCifrado}
        );
        res.json({msg: 'Usuario modificado'});
    } catch (error) {
        console.log(error);
    }
}

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
    modificaUsuario,
    eliminaUsuario
}