const Propiedad = require("../models/propiedad");


const getPropiedades = async(req, res) => {
    const { limit, offset, operacion, tipo, precioMin, precioMax } = req.query; 
    try {
        let propiedades;
        let filtros = {};

        //filtros
        //por operacion
        if(operacion){
            filtros["operacion.tipoOperacion"] = operacion; 
        }
        //tipo
        if(tipo && tipo !== "todos"){
            filtros.tipoPropiedad = tipo;
        }
        //precio MIN
        if(precioMin){
            filtros["operacion.precio"] = {...filtros["operacion.precio"], $gte: Number(precioMin)};
        }
        //precio MAX
        if(precioMax){
            filtros["operacion.precio"] = {...filtros["operacion.precio"], $lte: Number(precioMax)};
        }

        propiedades = await Propiedad.find(filtros)
        .skip(Number(offset) || 0)
        .limit(Number(limit) || 12)
        .exec();

        //obtengo el total de props q cumplen con los filtros (sin paginación)
        const totPropsFiltradas = await Propiedad.countDocuments(filtros);

        //envio las 12 props mas el total de las q cumplen los filtros
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