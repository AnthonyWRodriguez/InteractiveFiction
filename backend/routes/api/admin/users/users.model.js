var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    userModel = {};
    var usersCollection = db.collection("users");

    var userTemplate ={
        userID: "",
        userName: "",
        userProgress: "",
        userActive: true
    };

    userModel.getAll = (handler)=>{
        return usersCollection.find({}).toArray(handler);
    };

    return userModel;
}