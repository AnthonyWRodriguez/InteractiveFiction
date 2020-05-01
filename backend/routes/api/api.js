var express = require('express');
var router = express.Router();

function initApi(db){
    var adminRouter = require('./admin/admin')(db);
    router.use('/admin', adminRouter);

    var userRouter = require('./user/user')(db);
    router.use('/user', userRouter);

    return router;
}
module.exports = initApi;