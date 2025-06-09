const { Schema, model } = require('mongoose');

const PropiedadSchema = Schema({
    codigoReferencia: { type: Number},
    tituloPublicacion: { type: String },
    tipoPropiedad: { type: String },
    operacion: { type: String },
    moneda: { type: String },
    precio: { type: Number },
    descripcion: { type: String },    
    ubicacion: { type: Object }, //direc real, direc publi, pais, prov, ciudad, barrio    
    cantPisos: { type: Number},
    ambientes: { type: Number},
    dormitorios: { type: Number},
    baños: { type: Number},
    imagenes: { type: Array },
    video: { type: String },
    supCubierta: { type: Number, },
    supSemiCub: { type: Number },
    supDescubierta: { type: Number },
    supTotal: { type: Number },
    servicios: { type: Array },
    estado: { type: String },
    antiguedad: { type: Number },
    expesnsas: { type: Boolean},
    cantCocheras: { type: Number },
    estadoActual: { type: String },
});

module.exports = model("Propiedades", PropiedadSchema);