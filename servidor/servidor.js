//paquetes necesarios para el proyecto
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const controlador = require('./controladores/controlador');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
const puerto = '3000';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

app.get('/competencias', controlador.getCompetencia);
app.get('/competencias/:id/peliculas', controlador.getOpciones);
app.post('/competencias/:id/voto', controlador.votar);
app.get('/competencias/:id/resultados', controlador.getResultados);
