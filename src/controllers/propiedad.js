const Propiedad = require("../models/propiedad");



const Propiedad = require("../models/propiedad");

const getPropiedades = async (req, res) => {
    const { limit, offset, operacion, tipo, precioMin, precioMax } = req.query;
    try {
        let propiedades;
        let filtros = {};

        // Filtros
        // Por operacion
        if (operacion) {
            filtros["operacion.tipoOperacion"] = operacion;
        }
        // Tipo
        if (tipo) {
            filtros.tipoPropiedad = tipo;
        }
        // Precio MIN
        if (precioMin) {
            filtros["operacion.precio"] = { ...filtros["operacion.precio"], $gte: Number(precioMin) };
        }
        // Precio MAX
        if (precioMax) {
            filtros["operacion.precio"] = { ...filtros["operacion.precio"], $lte: Number(precioMax) };
        }
        // Sin filtros
        if (!operacion && !tipo && !precioMin && !precioMax) {
            filtros = {};
        }

        propiedades = await Propiedad.find(filtros)
            .skip(Number(offset) || 0)
            .limit(Number(limit) || 12)
            .exec();

        res.json(propiedades);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

//trae propiedad por id
const getPropiedad = async(req, res) => {
    const { id } = req.params;
    try {
        const propiedad = await Propiedad.findById(id).exec();

        if (!propiedad) {
            return res.status(404).json({ mensaje: "Propiedad no encontrada" });
        }

        res.status(200).json(propiedad);
    }
    catch (error) {
        console.error("Error en el controlador getPropiedad:", error);
        res.status(500).json({ mensaje: "Error del servidor", error: error.message });
    }
};

module.exports = {
    getPropiedades,
    getPropiedad,
}