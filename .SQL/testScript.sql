use damianber_plantthing;
insert ignore into slavedb values();
insert ignore into plantDB(minWater, maxWater, plantType, slaveID, portID) values(100,1000,"${plantType}", 1, 39);
-- insert into checkdb(plantID, time, moistureLevel) values((select plantID from plantdb where slaveID = 1 and portID = 39),now(),100);


-- select * from slavedb;
select * from checkdb;
select plantID from plantDB where slaveID = 1 and portID = 39;

insert ignore into requestDB(requestType, plantID, time) values("autoWatering", (select plantID from plantDB where slaveID = 1 and portID = 39), now());
select * from requestTypeDB;
select * from requestDB;