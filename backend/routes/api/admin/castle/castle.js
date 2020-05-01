var express = require('express');
var router = express.Router();

function initCastle (db) {

    var castleModel = require('./castle.model')(db);

    router.get('/allrooms', (req, res)=>{
        castleModel.getAllRooms((err, rooms)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(rooms);
        });
    });

    router.get('/', (req, res)=>{
        res.status(200).json({"msg":"Si llega"});
    })

    return router;

}
module.exports = initCastle;