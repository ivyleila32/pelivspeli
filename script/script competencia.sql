USE COMPETENCIAS;

create table if not exists pregunta(
 id int unsigned auto_increment not null,
 pregunta varchar (30),
primary key (id)
);

alter table pregunta MODIFY pregunta varchar(70);


