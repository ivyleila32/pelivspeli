USE COMPETENCIAS;
LOCK TABLES `pregunta` WRITE;
INSERT INTO `pregunta` VALUES (1,'¿que peli te gusto mas?'),(2,'¿que peli te hizo llorar mas?'),(3,'¿cual peli te resulto mas bizarra?'),(4,'¿que peli te dio mas miedo?');
UNLOCK TABLES;



ALTER TABLE pregunta
ADD COLUMN genero_id INT(11) unsigned;
ALTER TABLE pregunta 
ADD CONSTRAINT  FK_preguntaxgenero FOREIGN KEY (genero_id) REFERENCES genero(id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE pregunta
ADD COLUMN director_id INT(11) unsigned;
ALTER TABLE pregunta
ADD COLUMN actor_id INT(11) unsigned;

ALTER TABLE pregunta 
ADD CONSTRAINT  FK_preguntaxdirector FOREIGN KEY (director_id) REFERENCES director(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE pregunta 
ADD CONSTRAINT  FK_preguntaxactor FOREIGN KEY (actor_id) REFERENCES actor(id) ON DELETE RESTRICT ON UPDATE CASCADE;