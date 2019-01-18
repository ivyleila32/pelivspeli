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
};

function getCompetencia(req, res) {
    const sql = 'select id, pregunta as nombre from pregunta';
    conn.query(sql, (err, result) => {
        if (err) return res.status(500).send('ERROR');
        res.json(result);
    });
}

function getOpciones(req,res){
    const sql = `SELECT pregunta FROM pregunta WHERE id = ${req.params.id}`;
    conn.query(sql, (err, resCompetencia) => {
        if (err) return res.status(500).send('ERROR');
        if (res.length === 0) return res.status(404).send(`PREGUNTA ID=${req.params.id} NOT FOUND`);
        const competencia = resCompetencia[0];
        const sql2 = `
            SELECT id, poster, titulo
            FROM pelicula
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
        res.status(200).send('OK');
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

