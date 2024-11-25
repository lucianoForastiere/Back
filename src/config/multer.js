const multer = require("multer");
const path = require("path");

// Configuración de Multer para almacenar en memoria
module.exports = multer({
  storage: multer.memoryStorage(),  // Cambiamos a almacenamiento en memoria
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
      cb(new Error("File type is not supported"), false);
    } else {
      cb(null, true);
    }
  },
});
