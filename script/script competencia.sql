USE COMPETENCIAS;

create table if not exists competencia(
 id int unsigned auto_increment not null,
 pregunta varchar (30),
primary key (id)
);

alter table competencia MODIFY pregunta varchar(70);


