const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const dbConnection = require('./src/config/db');

dotenv.config();

//importo rutas
const routerPropiedad = require('./src/routes/propiedad');

const app = express();

//middlewares
app.use(express.json());
app.use(cors());

// Configuración de la base de datos
dbConnection();

//declaro rutas
app.use('/propiedades', routerPropiedad);

//puerto
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log("Puerto escuchando en:", PORT);
});