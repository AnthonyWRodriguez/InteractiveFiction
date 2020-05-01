var express = require('express');
var router = express.Router();

function initAdmin(db){
    var usersRouter = require('./users/users')(db);
    router.use('/users', usersRouter);

    return router;
}
module.exports = initAdmin;