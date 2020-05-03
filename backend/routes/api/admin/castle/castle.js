var express = require('express');
var router = express.Router();

function initCastle (db) {

    var castleModel = require('./castle.model')(db);

    router.get('/allRooms', (req, res)=>{
        castleModel.getAllRooms((err, rooms)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(rooms);
        });
    });

    router.post('/newRoom', (req, res)=>{
        var data = req.body;
        castleModel.newRoom(data, (err, room)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(room);
        });
    });


    router.put('/updateRoom', (req, res)=>{
        var id = req.body.id;
        var data = {
            "_id":id,
            ...req.body
        };
        castleModel.updateRoom(data, (err, upd)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(upd);
        });
    });

    router.put('/addObjectInv', (req, res)=>{
        var data = req.body;
        castleModel.addObjectInv(data, (err, upd)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(upd);
        });
    });

    return router;

}
module.exports = initCastle;