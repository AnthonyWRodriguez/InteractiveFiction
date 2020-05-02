var express = require('express');
var router = express.Router();

function initObjects (db) {

    var objectsModel = require('./invObjects.model')(db);

    router.get('/allObjects', (req, res)=>{
        objectsModel.getAllObjects((err, objects)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(objects);
        });
    });

    router.post('/newObject', (req, res)=>{
        var data = req.body;
        objectsModel.newObject(data, (err, object)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(object);
        });
    });
    
    return router;
}
module.exports = initObjects;