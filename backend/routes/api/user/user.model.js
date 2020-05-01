var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    userModel = {};

    userCollection = db.collection("users");

    var userTemplate ={
        userName: "",
        userProgress: "",
        userActive: true
    }

    userModel.newUser = (data, handler)=>{
        var name = data;
        return handler(null, {"msg":"this works"});
    }



    return userModel;
}