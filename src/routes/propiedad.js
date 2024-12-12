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
        venta,
        alquiler,
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

    try {
        // Subir imágenes a Cloudinary
        const imagenesUrls = await Promise.all(
            (req.files['imagenes'] || []).map((file) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: `propiedades/${tituloPublicacion}/imagenes` },
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
                    { folder: `propiedades/${tituloPublicacion}/videos`, resource_type: 'video' },
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
            venta,
            alquiler,
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

//actualiza
router.put('/editaProp/:_id', upload.fields([{ name: 'imagenes' }, { name: 'video' }]), async (req, res) => {
    const { _id } = req.params;    
    const {
        tituloPublicacion,
        descripcion,
        tipoPropiedad,
        expensas,
        ubicacion,
        venta,
        alquiler,
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
    
    try {
        // Buscar la propiedad por ID
        const propiedad = await Propiedad.findById(_id);
        if (!propiedad) {
            return res.status(404).send("Propiedad no encontrada");
        }

        // Subir imágenes a Cloudinary, pero si ya existen que no se repitan
        const imagenesUrls = await Promise.all(
            (req.files['imagenes'] || []).map(async (file) => {
                const existingImage = propiedad.imagenes.find(img => img.originalname === file.originalname);
                if (existingImage) {
                    return existingImage.url;
                } else {
                    const result = await cloudinary.uploader.upload(file.path, { folder: 'propiedades/imagenes' });
                    return result.secure_url;
                }
            })
        );

        // Subir el video a Cloudinary, pero si ya existe que no se repita
        let videoUrl = propiedad.video;
        if (req.files['video'] && req.files['video'][0]) {
            const existingVideo = propiedad.video && propiedad.video.originalname === req.files['video'][0].originalname;
            if (!existingVideo) {
                const result = await cloudinary.uploader.upload(req.files['video'][0].path, { folder: 'propiedades/videos', resource_type: 'video' });
                videoUrl = result.secure_url;
            }
        }

        // Crear el objeto de actualización sin el campo _id, NO hace falta actualizar el código de referencia( || propiedad.codigoReferencia)
        const updateData = {
            tituloPublicacion,
            descripcion,
            tipoPropiedad,
            expensas,
            ubicacion,
            venta,
            alquiler,
            cantPisos,
            ambientes,
            dormitorios,
            baños,
            imagenes: imagenesUrls.length ? imagenesUrls : propiedad.imagenes,
            video: videoUrl || propiedad.video,
            supCubierta,
            supSemiCub,
            supDescubierta,
            supTotal,
            servicios,
            estado,
            antiguedad,
            cantCocheras,
        };

        // Actualizar la propiedad
        const updatedPropiedad = await Propiedad.findByIdAndUpdate(_id, updateData, { new: true });

        res.status(200).send({
            message: "Propiedad actualizada con éxito",
            propiedad: updatedPropiedad,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar la propiedad");
    }
});

//elimina propiedad y eliminiar imagenes y video de cloudinary
router.delete('/eliminaProp/:_id', async (req, res) => {
    const { _id } = req.params; 
    try {
        // Buscar la propiedad por ID
        const propiedad = await Propiedad.findById(_id);
        if (!propiedad) {
            return res.status(404).send("Propiedad no encontrada");
        }

        // Eliminar las imágenes de Cloudinary
        await Promise.all(
            propiedad.imagenes.map((imagen) => {
                const public_id = imagen.split('/').slice(-1)[0].split('.')[0];
                return cloudinary.uploader.destroy(public_id);
            })
        );

        // Eliminar el video de Cloudinary
        if (propiedad.video) {
            const public_id = propiedad.video.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(public_id);
        }

        // Eliminar la propiedad de la base de datos
        await Propiedad.findByIdAndDelete(_id);

        res.status(200).send({
            message: "Propiedad eliminada con éxito",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar la propiedad");
    }
});







module.exports = router;