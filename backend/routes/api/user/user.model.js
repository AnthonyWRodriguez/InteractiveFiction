var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    userModel = {};

    userCollection = db.collection("users");

    var userTemplate ={
        userName: "",
        userProgress: "",
        userActive: false
    }

    userModel.newUser = (data, handler)=>{
        var name = data;
        var user = Object.assign(
            {},
            userTemplate,
            {
                userName: name,
                userProgress: null,
                userActive: true
            }
        );
        userCollection.insertOne(user, (err, rslt)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            return handler(null, rslt.ops);
        });
    };

    return userModel;
}