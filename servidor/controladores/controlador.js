const conn = require('../lib/conexiondb');

conn.connect(function (err) {
    if (err) throw err;
    console.log("Conectado a Mysql!");
});

module.exports = {
    getCompetencia,
    getOpciones,
    votar,
    getResultados,
    crearCompetencia,
    reiniciar,
    getGenero,
    getDirector,
    getActor,
    borrarCompetencia,
    getCompetenciaById,
    editarCompetencia,
};

function getCompetencia(req, res) {
    const sql = 'select id, pregunta as nombre from pregunta';
    conn.query(sql, (err, result) => {
        if (err) return res.status(500).send('ERROR');
        res.json(result);
    });
}

function getOpciones(req,res) {
    const idCompetencia = req.params.id;
    const sql = `SELECT pregunta FROM pregunta WHERE id = ${idCompetencia}`;
    conn.query(sql, (err, resCompetencia) => {
        if (err) return res.status(500).send('ERROR');
        if (res.length === 0) return res.status(404).send(`PREGUNTA ID=${idCompetencia} NOT FOUND`);
        const competencia = resCompetencia[0];
        const sql2 = `
            SELECT peli.id as id, peli.poster as poster, peli.titulo as titulo
            FROM pregunta preg
            LEFT JOIN actor_pelicula actpeli 
                ON actpeli.actor_id = preg.actor_id
            LEFT JOIN director_pelicula dirpeli 
                ON dirpeli.director_id = preg.director_id
            INNER JOIN pelicula peli 
                ON (peli.genero_id = preg.genero_id or preg.genero_id is null) AND 
                    (peli.id = actpeli.pelicula_id or preg.actor_id is null) AND 
                    (peli.id = dirpeli.director_id or preg.director_id is null)
            WHERE preg.id = ${idCompetencia}
            ORDER BY RAND()
            LIMIT 2;
        `;
        conn.query(sql2, (err2, resPeliculas) => {
            if (err2) return res.status(500).send('ERROR');
            res.json({
                competencia: competencia.pregunta,
                peliculas: resPeliculas,
            });
        });
    });

}


 function votar(req,res) {
    const idCompetencia = req.params.id;
    const idPelicula = req.body.idPelicula;
    const sql = `INSERT INTO competencias.votos (pregunta_id, pelicula_id) VALUES (${idCompetencia}, ${idPelicula});`;
    conn.query(sql, (err, result) => {
        if (err) return res.status(500).send('ERROR');
        // res.status(200).send('OK');
        // Tengo que retornar JSON porque sino, el front no redirige
        res.json({ status: 'OK'});
    });
 }

 function getResultados(req, res) {
    const idCompetencia = req.params.id;
    const cantRes = 3;
    const sql = `SELECT pregunta FROM pregunta WHERE id = ${idCompetencia}`;
    const sql2 = `
        SELECT pel.id AS pelicula_id, pel.titulo, pel.poster, count(*) AS votos
        FROM pelicula pel
        INNER JOIN votos vot ON vot.pelicula_id = pel.id
        WHERE vot.pregunta_id = ${idCompetencia}
        GROUP BY pel.id, pel.titulo, pel.poster
        ORDER BY votos DESC
        LIMIT ${cantRes};
    `;
    console.log(sql, sql2);
    conn.query(sql, (err, result) => {
        if (err) return res.status(500).send('ERROR');
        if (result.length === 0) return res.status(404).send('COMPETENCIA NOT FOUND');
        const competencia = result[0].pregunta;
        conn.query(sql2, (err2, result2) => {
            if (err2) return res.status(500).send('ERROR');
            res.json({
                competencia,
                resultados: result2,
            });
        });    
    });
 }


function crearCompetencia(req,res) {
    const pregunta = req.body.nombre;
    const generoId = parseInt(req.body.genero) === 0 ? 'NULL' : req.body.genero; 
    const directorId = parseInt(req.body.director) === 0 ? 'NULL' : req.body.director; 
    const actorId = parseInt(req.body.actor) === 0 ? 'NULL' : req.body.actor; 
    const sql1 = `SELECT pregunta from pregunta where pregunta = '${pregunta}'`;
    const sql2 = `INSERT INTO pregunta (pregunta, genero_id, director_id, actor_id) VALUES ('${pregunta}', ${generoId}, ${directorId}, ${actorId})`;
    console.log(sql2);
    conn.query(sql1, (err, valoring) => {
        if (err) return res.status(500).send('ERROR');
        // res.status(200).send('OK');
        // Tengo que retornar JSON porque sino, el front no redirige
        if (valoring.length > 0) {
            return res.status(422).send('esa competencia ya existe');
        }
        conn.query(sql2, (err, result) => {
            if (err) return res.status(500).send('ERROR');
            res.json({ status: 'OK'});
        });
    });
    
}

function reiniciar(req,res) {
    const idCompetencia = req.params.id;
    const sql1 = `SELECT pregunta from pregunta where id = ${idCompetencia}`;
    const sql2 = `delete from votos where pregunta_id = ${idCompetencia}`;
    conn.query(sql1, (err, valoring) => {
        if (err) return res.status(500).send('ERROR');
        // res.status(200).send('OK');
        // Tengo que retornar JSON porque sino, el front no redirige
        if (valoring.length === 0) {
            return res.status(422).send('esa competencia no existe');
        }
        conn.query(sql2, (err, result) => {
            if (err) return res.status(500).send('ERROR');
            res.json({ status: 'OK'});
        });
    });
    
}
function getGenero(req,res) {
    const sql = 'select id, nombre from genero';
    conn.query(sql, (err, result) => {
        if (err) return res.status(500).send('ERROR');
        res.json(result);
    });

}

function getDirector(req,res) {
    const sql = 'select id, nombre from director';
    conn.query(sql, (err, result) => {
        if (err) return res.status(500).send('ERROR');
        res.json(result);
    });
    
}

function getActor(req,res) {
    const sql = 'select id, nombre from actor';
    conn.query(sql, (err, result) => {
        if (err) return res.status(500).send('ERROR');
        res.json(result);
    });
}
function borrarCompetencia(req,res) {
    const idCompetencia = req.params.id;
    const sql1 = `SELECT pregunta from pregunta where id = ${idCompetencia}`;
    const sql2 = `DELETE from pregunta where id = ${idCompetencia}`;
    console.log(sql2);
    conn.query(sql1, (err, valoring) => {
        if (err) return res.status(500).send('ERROR');
        // res.status(200).send('OK');
        // Tengo que retornar JSON porque sino, el front no redirige
        if (valoring.length === 0) {
            return res.status(422).send('esa competencia no existe');
        }
        conn.query(sql2, (err, result) => {
            if (err) return res.status(500).send('ERROR');
            res.json({ status: 'OK'});
        });
    });
}    

function getCompetenciaById(req, res) {
    const idCompetencia = req.params.id;
    const sql1 = `  SELECT p.id, p.pregunta as nombre, g.nombre as genero_nombre, a.nombre as actor_nombre, d.nombre as director_nombre 
                    FROM pregunta p
                    LEFT JOIN genero g on g.id = p.genero_id
                    LEFT JOIN actor a on a.id = p.actor_id
                    LEFT JOIN director d on d.id = p.director_id
                    WHERE p.id = ${idCompetencia}`;
    // console.log(sql1);
    conn.query(sql1, (err, valoring) => {
        if (err) return res.status(500).send('ERROR');
        if (valoring.length === 0) {
            return res.status(422).send('esa competencia no existe');
        }
        return res.json(valoring[0]);
    });
    
}

function editarCompetencia(req,res) {
    const idCompetencia = req.params.id;
    const nuevoNombre = req.body.nombre;
    const sql1 = `SELECT pregunta from pregunta where id = ${idCompetencia}`;
    const sql2 =`UPDATE pregunta SET pregunta = '${nuevoNombre}' WHERE id = ${idCompetencia}`;
    console.log(sql2);
    conn.query(sql1, (err, valoring) => {
        if (err) return res.status(500).send('ERROR');
        if (valoring.length === 0) {
            return res.status(422).send('esa competencia no existe');
        }
        conn.query(sql2, (err, result) => {
            if (err) return res.status(500).send('ERROR');
            res.json({ status: 'OK'});
        });
    });
    
    
}




    



