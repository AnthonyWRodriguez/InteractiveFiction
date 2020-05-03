var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    userModel = {};

    userCollection = db.collection("users");
    castleCollection = db.collection("castle");

    var userTemplate ={
        userName: "",
        userProgress: "",
        userInventory: [],
        userLeftEquip: "",
        userRightEquip: "",
        userCurrentRoom: "",
        userRole: "",
        userActive: false
    }

    userModel.newUser = (data, handler)=>{
        castleCollection.find({}).toArray((err, res)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            var name = data;
            var sword = "Steel Sword";
            var fist = "Fist";
            var room = new ObjectID("5eacf27a2c15fc3cbcc80c6a");
            var user = Object.assign(
                {},
                userTemplate,
                {
                    userName: name,
                    userProgress: res,
                    userInventory: [sword],
                    userLeftEquip: fist,
                    userRightEquip: fist,
                    userCurrentRoom: room,
                    userRole: "player",
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

    userModel.currentUser = (data, handler)=>{
        var id = data;
        var query = {"_id": new ObjectID(id)};
        userCollection.findOne(
            query,
            (err, user)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, user);
            }
        )
    };

    userModel.dropObject = (data, handler)=>{
        var {id, inv, obj, room} = data;
        var query = {"_id": new ObjectID(id)};
        var updateCommand = {
            $set:{
                "userInventory": inv
            },
            $push:{
                "userProgress.$[r].roomDropped": obj
            }
        };
        var filter = {
            arrayFilters: [
                {
                    "r._id":new ObjectID(room)
                }
            ],
            multi: true,
        };
        userCollection.findOneAndUpdate(
            query,
            updateCommand,
            filter,
            (err, upd)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, upd);
            }
        )
    };

    return userModel;
}