var express = require('express');
var router = express.Router();

function initUser (db) {

    var userModel = require('./user.model')(db);

    router.post('/new', (req, res)=>{
        var data = req.body.name;
        userModel.newUser(data, (err,user)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"error"});
            }
            return res.status(200).json(user);
        });
    });

    router.get('/myUser', (req, res)=>{
        var data = req.body.id;
        userModel.currentUser(data, (err, user)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(user);
        });
    });

    router.put('/drop', (req, res)=>{
        var a = req.body.inventory;
        a = a.replace(/'/g, '"');
        a = JSON.parse(a);
        var data = {
            "inv": a,
            ...req.body
        }
        console.log(a);
        userModel.dropObject(data, (err, drop)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(drop);
        });
    });

    router.put('/equip', (req, res)=>{
        var data = req.body;
        userModel.equipObject(data, (err, equip)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(equip);
        });
    });

    return router;
}
module.exports = initUser;