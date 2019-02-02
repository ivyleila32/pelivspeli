use competencias;

create table if not exists votos(
 id int unsigned auto_increment not null,
 pregunta_id int unsigned,
 pelicula_id int unsigned,
 fecha_hora datetime,
primary key (id)
);

ALTER TABLE votos
ADD CONSTRAINT  FK_votosxpregunta FOREIGN KEY (pregunta_id) REFERENCES pregunta(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE votos
ADD CONSTRAINT FK_votosxpelicula FOREIGN KEY (pelicula_id) REFERENCES pelicula (id) ON DELETE RESTRICT ON UPDATE CASCADE;