var express = require('express');
var router = express.Router();

function initUsers (db) {

    var userModel = require('./users.model')(db);

    router.get('/all', (req, res)=>{
        userModel.getAll((err, users)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"msg":"Error"});
            }
            return res.status(200).json(users);
        });
    });

    return router;

}
module.exports = initUsers;
