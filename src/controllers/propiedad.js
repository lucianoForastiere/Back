const Propiedad = require("../models/propiedad");



const getPropiedades = async (req, res) => {
    const limit = Number(req.query.limit) || 12; // Por defecto 12
    const offset = Number(req.query.offset) || 0; // Por defecto 0
    const operacion = req.query.operacion || null;
    const tipo = req.query.tipo || null;
    const precioMin = req.query.precioMin ? Number(req.query.precioMin) : null;
    const precioMax = req.query.precioMax ? Number(req.query.precioMax) : null;

    try {
        let filtros = {};

        if (operacion) filtros["operacion.tipoOperacion"] = operacion;
        if (tipo) filtros.tipoPropiedad = tipo;
        if (precioMin) filtros["operacion.precio"] = { ...filtros["operacion.precio"], $gte: precioMin };
        if (precioMax) filtros["operacion.precio"] = { ...filtros["operacion.precio"], $lte: precioMax };

        const propiedades = await Propiedad.find(filtros).skip(offset).limit(limit).exec();
        const totPropsFiltradas = await Propiedad.countDocuments(filtros);

        res.status(200).json({ totPropsFiltradas, propiedades });
    } catch (error) {
        console.error("Error en getPropiedades:", error);
        res.status(500).json({ mensaje: "Error del servidor", error: error.message });
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