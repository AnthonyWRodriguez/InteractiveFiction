var express = require('express');
var router = express.Router();

function initObjects(db){
    var invObjectsRouter = require('./invObjects/invObjects')(db);
    router.use('/inv', invObjectsRouter);

    var envObjectsRouter = require('./envObjects/envObjects')(db);
    router.use('/env', envObjectsRouter);

    return router;
}
module.exports = initObjects;