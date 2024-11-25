const express = require('express');
const {  getPropiedades, getPropiedad } = require('../controllers/propiedad');
const Propiedad = require("../models/propiedad");
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer'); 

const router = express.Router();

//rutas

//trae props
router.get('/', getPropiedades);

//trae propiedad por id
router.get('/:id', getPropiedad);

//crea
router.post('/', upload.fields([{ name: 'imagenes' }, { name: 'video' }]), async (req, res) => {
    const {
        tituloPublicacion,
        descripcion,
        tipoPropiedad,
        expensas,
        ubicacion,
        operacion,
        cantPisos,
        ambientes,
        dormitorios,
        baños,
        supCubierta,
        supSemiCub,
        supDescubierta,
        supTotal,
        servicios,
        estado,
        antiguedad,
        cantCocheras,
    } = JSON.parse(req.body.data); // Parsear los datos del formulario 
    console

    try {
        // Subir imágenes a Cloudinary
        const imagenesUrls = await Promise.all(
            (req.files['imagenes'] || []).map((file) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: 'propiedades/imagenes' },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result.secure_url);
                        }
                    );
                    uploadStream.end(file.buffer); // Enviar buffer a Cloudinary
                });
            })
        );

        // Subir el video a Cloudinary, si existe
        let videoUrl = null;
        if (req.files['video'] && req.files['video'][0]) {
            const videoResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'propiedades/videos', resource_type: 'video' },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result.secure_url);
                    }
                );
                uploadStream.end(req.files['video'][0].buffer);
            });
            videoUrl = videoResult;
        }

        // Obtener el último código de referencia o generar uno nuevo
        const lastPropiedad = await Propiedad.findOne().sort({ codigoReferencia: -1 });
        const codigoReferencia = lastPropiedad ? lastPropiedad.codigoReferencia + 1 : 1;

        // Crear el objeto de Propiedad
        const nuevaProp = new Propiedad({
            codigoReferencia,
            tituloPublicacion,
            descripcion,
            tipoPropiedad,
            expensas,
            ubicacion,
            operacion,
            cantPisos,
            ambientes,
            dormitorios,
            baños,
            imagenes: imagenesUrls,
            video: videoUrl,
            supCubierta,
            supSemiCub,
            supDescubierta,
            supTotal,
            servicios,
            estado,
            antiguedad,
            cantCocheras,
        });

        // Guardar la nueva propiedad en la base de datos
        await nuevaProp.save();

        res.status(200).send({
            message: "Propiedad creada con éxito",
            propiedad: nuevaProp,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear la propiedad");
    }
});





module.exports = router;