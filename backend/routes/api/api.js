var express = require('express');
var router = express.Router();

function initApi(db){
    var adminRouter = require('./admin/admin')(db);
    router.use('/admin', adminRouter);

    router.get('/', (req, res)=>{
        res.status(200).json({"msg":"si pasa"});
    })

    return router;
}
module.exports = initApi;