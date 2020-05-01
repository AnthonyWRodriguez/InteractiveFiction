var express = require('express');
var router = express.Router();

function initAdmin(db){
    var usersRouter = require('./users/users')(db);
    router.use('/users', usersRouter);

    router.get('/', (req, res)=>{
        res.status(200).json({"msg":"si pasa"});
    })

    return router;
}
module.exports = initAdmin;