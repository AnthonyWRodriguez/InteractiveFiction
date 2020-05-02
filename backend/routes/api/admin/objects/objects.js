var express = require('express');
var router = express.Router();

function initObjects (db) {

    var objectsModel = require('./objects.model')(db);

    router.get('/allObjects', (req, res)=>{
        objectsModel.getAllObjects((err, objects)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(objects);
        });
    });

    return router;
}
module.exports = initObjects;