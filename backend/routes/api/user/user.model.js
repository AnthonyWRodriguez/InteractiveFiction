var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    userModel = {};

    userCollection = db.collection("users");
    castleCollection = db.collection("castle");

    var userTemplate ={
        userName: "",
        userProgress: "",
        userActive: false
    }

    userModel.newUser = (data, handler)=>{
        castleCollection.find({}).toArray((err, res)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            var name = data;
            var user = Object.assign(
                {},
                userTemplate,
                {
                    userName: name,
                    userProgress: res,
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
        });
    };

    return userModel;
}