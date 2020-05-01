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

    return router;
}
module.exports = initUser;