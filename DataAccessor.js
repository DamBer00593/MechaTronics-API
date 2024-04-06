const { json } = require('express');
const mysql = require('mysql2');
let conn;
async function createConn(host, username, password, database){
    conn = mysql.createConnection({
        host: host,
        user: username,
        password: password,
        database: database
    });
}
async function startConn(){
    conn.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });
}

async function openConn(sql) {
        return new Promise(((resolve, reject) => {
            conn.query(sql, function (err, result, fields) {
                if (err) reject(JSON.stringify(err));
                resolve(result)
            })
        }), 200);    
}

async function openConnWithLastInsertReturn(sql) {
        return new Promise(((resolve, reject) => {
            conn.query(sql, function (err, result, fields) {
                if (err) reject(err);
                conn.query("select last_insert_id() as lastID;", function (err, result, fields) {
                    if (err) reject(err);
                      resolve(result);
                })
                
            })
        }), 200);    
}

async function getVersion(){
    let response = await openConn(`select version();`);
    let json = JSON.stringify(response);
    return json;
}

async function getSlaves(){
    let response = await openConn(`select * from slaveDB;`);
    let json = JSON.stringify(response);
    return json;
}

async function getChecks(){
    let response = await openConn(`select * from checkDB;`);
    let json = JSON.stringify(response);
    return json;
}

async function addSlaveV1(){
    let respons = await openConn(`insert into slaveDB values();`);
    let response = await openConn(`select slaveID as lastID from slaveDB order by slaveid desc limit 1;`)
    let json = JSON.stringify(response);
    return json;
}
async function addSlaveV2(){
    let response = await openConnWithLastInsertReturn(`insert into slaveDB values();`);
    let json = JSON.stringify(response);
    return json;
}

async function addPlant(minWater, maxWater, plantType, slaveID, portID){
    await validateInput([minWater, maxWater, plantType, slaveID, portID])
    let response = await openConn(`insert into plantDB(minWater, maxWater, plantType, slaveID, portID) values(${minWater},${maxWater},"${plantType}", ${slaveID}, ${portID});`);
    let json = JSON.stringify(response);
    return json;

    
}

async function getPlantByPortAndSlaveID(slaveID, portID){
    await validateInput([slaveID, portID])
    let response = await openConn(`select plantID from plantDB where slaveID = ${slaveID} and portID = ${portID}`);
    let json = JSON.stringify(response);
    return json;

}

async function addCheckV1(plantID, moistureLevel){
    await validateInput([plantID, moistureLevel])
    let response = await openConn(`insert into checkDB(plantID, time, moistureLevel) values(${plantID},now(),${moistureLevel})`);
    let json = JSON.stringify(response);
    return json;

}

async function addRequestV1(requestType, plantID){
    await validateInput([requestType, plantID])
    let response = await openConn(`insert into requestDB(requestType, plantID, time) values("${requestType}", ${plantID}, now());`);
    let json = JSON.stringify(response);
    return json;
}

async function addCheckV2(slaveID, portID, moistureLevel){
    await validateInput([slaveID, portID, moistureLevel])
    let response = await openConn(`insert into checkDB(plantID, time, moistureLevel) values((select plantID from plantDB where slaveID = ${slaveID} and portID = ${portID}),now(),${moistureLevel});`);
    let json = JSON.stringify(response);
    return json;
}


async function addRequestV2(slaveID, portID, requestType){
    await validateInput([slaveID, portID, requestType])
    let response = await openConn(`insert into requestDB(requestType, plantID, time) values("${requestType}", (select plantID from plantDB where slaveID = ${slaveID} and portID = ${portID}), now());`);
    let json = JSON.stringify(response);
    return json;
}

async function getRequests(){
    let response = await openConn(`select * from requestDB;`);
    let json = JSON.stringify(response);
    return json;
}

async function getPlants(){
    let response = await openConn(`select * from plantDB;`);
    let json = JSON.stringify(response);
    return json;
}

async function validateInput(inputArray){
    return new Promise(((resolve, reject) => {
        for(let i = 0; i < inputArray.length; i++){
            console.log(inputArray[i])
            if(inputArray[i] == undefined){
                reject((`{"Error":"Some values are missing"}`));   
            }
        }
        resolve(true)
    }), 200);   
}

exports.createConn = createConn;
exports.startConn = startConn;

exports.getVersion = getVersion;
exports.getSlaves = getSlaves;
exports.getRequests = getRequests;
exports.getPlants = getPlants;
exports.getChecks = getChecks;

exports.addSlaveV1 = addSlaveV1;
exports.addSlaveV2 = addSlaveV2;
exports.addPlant = addPlant;

exports.addCheckV1 = addCheckV1;
exports.addRequestV1 = addRequestV1;
exports.getPlantByPortAndSlaveID = getPlantByPortAndSlaveID;

exports.addCheckV2 = addCheckV2;
exports.addRequestV2 = addRequestV2;
