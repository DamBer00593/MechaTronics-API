const express = require("express");
const DataA = require("./DataAccessor.js");
const app = express()
const port = 3000
const config = require('./settings.json');

app.use(express.json()); // needed to parse JSON data in POST/PUT requests
DataA.createConn(config.dbHost, config.dbUser, config.dbPassword, config.dbDatabase);

//damianber_plantthing

//damianber_plantthingg
//mMwWw*@3CLDBs$b&Uu

app.get('/', async (req, res) => {

    let response =   DataA.getVersion();
    response.then(
        result => res.status(200).json(JSON.parse(result)),
        error => res.status(500).json(JSON.parse(error)) 
    ); 
})

app.get('/api/docs', async (req,res) => {
    res.redirect('https://documenter.getpostman.com/view/23736602/2sA35MxJLo')
})

app.get('/requests/', async (req,res) => {
	let response =   DataA.getRequests();
    response.then(
        result => res.status(200).json(JSON.parse(result)),
        error => res.status(500).json(JSON.parse(error)) 
    );
})

app.get('/checks/', async (req,res) => {
	let response = DataA.getChecks();
    response.then(
        result => res.status(200).json(JSON.parse(result)),
        error => res.status(500).json(JSON.parse(error)) 
    );
})
app.get('/plants/', async (req,res) => {
	let response = DataA.getPlants();
    response.then(
        result => res.status(200).json(JSON.parse(result)),
        error => res.status(500).json(JSON.parse(error)) 
    );
})
app.get('/slaves/', async (req,res) => {
  let response =   DataA.getSlaves();
  response.then(
        result => res.status(200).json(JSON.parse(result)),
        error => res.status(500).json(JSON.parse(error)) 
  );  
})

app.post('/init/slave', async (req, res) => {
  //adding a slave to the database
  //This will be called automatically by the master to assign IDS to slaves on first boot
  let response = DataA.addSlaveV2();
  response.then(
        result => res.status(201).json(JSON.parse(result)),
        error => res.status(500).json(JSON.parse(error)) 
  );
  //return new slave id last_insert_id()
})
app.post('/init/plant', async (req, res) => {
        let bod = req.body;
        let minWater = bod.minWater;
        let maxWater = bod.maxWater;
        let plantType = bod.plantType;
        let slaveID = bod.slaveID;
        let portID = bod.portID;
        let response =   DataA.addPlant(minWater, maxWater, plantType, slaveID, portID);
        response.then(
                result => res.status(201).json(JSON.parse(result)),
                error => res.status(500).json(JSON.parse(error)) 
        );
}) 


app.post('/v2/check/', async (req, res) => {
  let body = req.body;
  let slaveID = body.slaveID;
  let portID = body.portID;
  let moistureLevel = body.moistureLevel;
  let response =   DataA.addCheckV2(slaveID, portID, moistureLevel);
  response.then(
        result => res.status(201).json(JSON.parse(result)),
        error => res.status(500).json(JSON.parse(error)) 
  );
})
app.post('/v1/check/:slaveID/:portID/:moistureLevel', async (req, res) => {
  let param = req.params;
  let slaveID = param.slaveID;
  let portID = param.portID;
  let moistureLevel = param.moistureLevel;
  let response =   DataA.addCheckV2(slaveID, portID, moistureLevel);
  response.then(
        result => res.status(201).json(JSON.parse(result)),
        error => res.status(500).json(JSON.parse(error)) 
  );
})

app.post('/v2/request/', async (req, res) => {
    let body = req.body;
    let slaveID = body.slaveID;
    let portID = body.portID;
    let requestType = body.requestType;
    let response =   DataA.addRequestV2(slaveID, portID, requestType);
    response.then(
            result => res.status(201).json(JSON.parse(result)),
            error => res.status(500).json(JSON.parse(error)) 
    );
})
app.post('/v1/request/:slaveID/:portID/:requestType', async (req, res) => {
  let param = req.params;
  let slaveID = param.slaveID;
  let portID = param.portID;
  let requestType = param.requestType;
  let response = DataA.addRequestV2(slaveID, portID, requestType);
  // res.status(200).json(JSON.parse(result))
  response.then(
        result => res.status(201).json(JSON.parse(result)),
        error => res.status(500).json(JSON.parse(error)) 
  );
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  DataA.startConn();
})