const { Schema, model } = require('mongoose');

const PropiedadSchema = Schema({
    codigoReferencia: { type: Number},
    tituloPublicacion: { type: String },
    descripcion: { type: String },
    tipoPropiedad: { type: String },
    venta: { type: Object }, 
    alquiler: { type: Object },    
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
});

module.exports = model("Propiedades", PropiedadSchema);