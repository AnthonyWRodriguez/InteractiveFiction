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
        var val = parseInt(req.body.valueS);
        var wei = parseInt(req.body.weightS);
        var data = {
            "value": val,
            "weight": wei,
            ...req.body
        };
        objectsModel.newObject(data, (err, object)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(object);
        });
    });

    router.put('/updateObject', (req, res)=>{
        var val = parseInt(req.body.valueS);
        var wei = parseInt(req.body.weightS);
        var data = {
            "value": val,
            "weight": wei,
            ...req.body
        };
        objectsModel.updateObject(data, (err, upd)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(upd);
        });
    });
    
    return router;
}
module.exports = initObjects;