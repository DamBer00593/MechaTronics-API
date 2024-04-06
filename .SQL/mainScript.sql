drop database if exists damianber_plantthing;
create database damianber_plantthing;
use damianber_plantthing;

drop table if exists slaveDB;
-- drop table if exists slavePortDB;
drop table if exists plantDB;
drop table if exists requestTypeDB;
drop table if exists requestDB;
drop table if exists checkDB;
create table slaveDB(
    slaveID Integer auto_increment,
    slaveName varChar(255),
    primary key(slaveID)
);

-- create table slavePortDB(
--     slaveID Integer not null,
--     portID Integer not null,
--     active boolean not null default(false),
--     primary key(slaveID, portID),
--     foreign key(slaveID) references slaveDB(slaveID)
-- );

create table plantDB(
    plantID Integer auto_increment primary key,
    minWater Integer not null,
    maxWater Integer not null,
    plantType varchar(255),
    slaveID Integer not null,
    portID Integer not null,
    active boolean not null default(true),
    foreign key(slaveID) references slaveDB(slaveID)
);
create unique index slavePortPlant on plantDB(slaveID, portID);

create table requestTypeDB(
    requestType varchar(255) not null primary key
);

-- requestTypes (check, autowatering, manualWatering)
insert into requestTypeDB values("check"); -- check - manual check of water level on specific plant
insert into requestTypeDB values("autoWatering"); -- autowatering - automatic watering of plant
insert into requestTypeDB values("manualWatering"); -- manualwatering - user started watering of plant
-- test? manual operating of plant valves/pump?

create table requestDB(
    requestID Integer auto_increment primary key,
    requestType varchar(255) not null,
    plantID Integer not null,
    time datetime not null,
    completed boolean not null default(false),
    foreign key(plantID) references plantDB(plantID),
    foreign key (requestType) references requestTypeDB(requestType)
);

create table checkDB(
    checkID Integer auto_increment,
    plantID Integer not null,
    time datetime not null,
    moistureLevel Integer not null,
    primary key(checkID),
    foreign key(plantID) references plantDB(plantID)
);