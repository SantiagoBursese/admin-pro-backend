require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config')
    //Crear el servidor express
const app = express();

// Configurar cors
app.use(cors());

// Lectura y parse del body
app.use(express.json())

//Base de datos
dbConnection();


//NOSQ1YbbB4ely7Mw
//mean_user
//Rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/login', require('./routes/auth'))

app.listen(process.env.port, () => {
    console.log('Servidor corriendo en puerto ' + process.env.port)
})