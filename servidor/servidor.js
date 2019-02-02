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
app.post('/competencias', controlador.crearCompetencia);
app.get('/competencias/:id/peliculas', controlador.getOpciones);
app.post('/competencias/:id/voto', controlador.votar);
app.get('/competencias/:id/resultados', controlador.getResultados);
app.delete('/competencias/:id/votos', controlador.reiniciar);
app.get('/generos', controlador.getGenero);
app.get('/directores', controlador.getDirector);
app.get('/actores', controlador.getActor);
app.get('/competencias/:id', controlador.getCompetenciaById);
app.delete('/competencias/:id', controlador.borrarCompetencia);
app.put('/competencias/:id',controlador.editarCompetencia);
