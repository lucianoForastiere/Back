const { Schema, model } = require('mongoose');

const PropiedadSchema = Schema({
    codigoReferencia: { type: Number},
    tituloPublicacion: { type: String },
    descripcion: { type: String },
    tipoPropiedad: { type: String },
    expesnsas: { type: Boolean},
    //location: { type: Point, coordinates: [-73.935242, 40.730610] }
    ubicacion: { type: Object }, //direc real, direc publi, pais, prov, ciudad, barrio
    operacion: { type: Array }, //{operacionID: 1-venta o 2-Alq, tipoOperacion, precio, moneda}
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
    cantCocheras: { type: Number },
});

module.exports = model("Propiedades", PropiedadSchema);