const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({ 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'Admin' },
});

module.exports = model("Usuario", UsuarioSchema);