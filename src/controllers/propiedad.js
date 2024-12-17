const Propiedad = require("../models/propiedad");

const getPropiedades = async (req, res) => {
    const { limit, offset, operacion, tipo, precioMin, precioMax } = req.query;

    try {
        let propiedades;
        let filtros = {};

        // Filtros
        // Por operacion
        if (operacion && operacion !== "todas") {
            filtros["operacion"] = operacion;
        }
        // Tipo
        if (tipo && tipo !== "todos") {
            filtros.tipoPropiedad = tipo;
        }
        // Precio MIN
        if (precioMin) {
            filtros.precio = { $gte: precioMin };            
        }
        // Precio MAX
        if (precioMax ) {
            filtros.precio = { ...filtros.precio, $lte: precioMax };            
        }

        // Realizar la consulta con los filtros aplicados
        propiedades = await Propiedad.find(filtros)
            .skip(Number(offset) || 0)
            .limit(Number(limit) || 12)
            .exec();

        // Obtengo el total de propiedades que cumplen con los filtros (sin paginación)
        const totPropsFiltradas = await Propiedad.countDocuments(filtros);

        // Envío las propiedades más el total de las que cumplen los filtros
        res.status(200).json({
            totPropsFiltradas,
            propiedades
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error del servidor" });
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
        console.log(error);
        res.status(500).json({ mensaje: "Error del servidor" });
    }
};



module.exports = {
    getPropiedades,
    getPropiedad,
}