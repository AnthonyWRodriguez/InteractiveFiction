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
            var healHerb = "Healing Herb";
            var shield = "Iron Shield";
            var fist = "Fist";
            var room = new ObjectID("5eae5849ed6b166964fdbb2c");
            var user = Object.assign(
                {},
                userTemplate,
                {
                    userName: name,
                    userProgress: res,
                    userInventory: [sword, healHerb, healHerb, shield],
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

    userModel.currentRoom = (data, handler)=>{
        var {userID, roomID} = data;
        var query = {"_id": new ObjectID(userID)};
        userCollection.findOne(
            query,
            (err, user)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                var index;
                for(var x=0;x<user.userProgress.length;x++){
                    if(user.userProgress[x]._id==roomID){
                        index = x;
                        break;
                    }
                }
                return handler(null, user.userProgress[index]);
            }
        )
    }

    userModel.dropObject = (data, handler)=>{
        var {id, inv, obj, duplicate, dir, room} = data;
        var query = {"_id": new ObjectID(id)};
        var updateCommand = "";
        if(duplicate==="true"){
            updateCommand = {
                $set:{
                    "userInventory": inv
                },
                $push:{
                    "userProgress.$[r].roomObjectsInv": obj
                }
            };    
        }else{
            if(dir==="left"){
                updateCommand = {
                    $set:{
                        "userInventory": inv,
                        "userLeftEquip": "Fist"
                    },
                    $push:{
                        "userProgress.$[r].roomObjectsInv": obj
                    }
                };
            }else{
                updateCommand = {
                    $set:{
                        "userInventory": inv,
                        "userRightEquip": "Fist"
                    },
                    $push:{
                        "userProgress.$[r].roomObjectsInv": obj
                    }
                };
            } 
        }
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

    userModel.grabObject = (data, handler)=>{
        var {idU, idR, obj, objs} = data;
        var query = {"_id":new ObjectID(idU)};
        var updateCommand = {
            $push:{
                "userInventory": obj
            },
            $set:{
                "userProgress.$[r].roomObjectsInv": objs
            }
        };
        var filter = {
            arrayFilters: [
                {
                    "r._id":new ObjectID(idR)
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

    userModel.equipObject = (data, handler) =>{
        var {id, nameObj, direction} = data;
        var query = {"_id": new ObjectID(id)};
        var updateCommand="";
        if(direction==="left"){
            updateCommand = {
                $set:{
                    "userLeftEquip": nameObj
                }
            }    
        }else{
            updateCommand = {
                $set:{
                    "userRightEquip": nameObj
                }
            }  
        }
        userCollection.findOneAndUpdate(
            query,
            updateCommand,
            (err, upd)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, upd);
            }
        )
    };

    userModel.unequipObject = (data, handler)=>{
        var{id, direction} = data;
        var query = {"_id": new ObjectID(id)};
        var updateCommand="";
        if(direction==="left"){
            updateCommand = {
                $set:{
                    "userLeftEquip": "Fist"
                }
            }    
        }else{
            updateCommand = {
                $set:{
                    "userRightEquip": "Fist"
                }
            }  
        }
        userCollection.findOneAndUpdate(
            query,
            updateCommand,
            (err, upd)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, upd);
            }
        )
    }

    return userModel;
}