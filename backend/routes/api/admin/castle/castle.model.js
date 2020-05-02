var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    castleModel = {};
    var castleCollection = db.collection("castle");

    var roomTemplate = {
        roomName: "",
        roomEnter: "",
        roomEnterEnemy: "",
        roomLook: "",
        roomLeft: "",
        roomRight: "",
        roomForward: "",
        roomBackward: "",
        roomDropped: [],
        roomObjectsInv: [],
        roomObjectsEnv: [],
        roomEnemy: "",
        roomEnemyHealth: "",
        roomEnemyAlive: false
    };

    castleModel.getAllRooms = (handler) => {
        return castleCollection.find({}).toArray(handler);
    };

    castleModel.newRoom = (data, handler) =>{
        var {name, enter, look, left, right, forward, backward, } = data;
        var room = Object.assign(
            {},
            roomTemplate,
            {
                roomName: name,
                roomEnter: enter,
                roomEnterEnemy: "",
                roomLook: look,
                roomLeft: left,
                roomRight: right,
                roomForward: forward,
                roomBackward: backward,
                roomDropped: [],
                roomObjectsInv: [],
                roomObjectsEnv: [],
                roomEnemy: "",
                roomEnemyHealth: "",
                roomEnemyAlive: false
            }
        );
        castleCollection.insertOne(room, (err, rslt)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            return handler(null, rslt.ops);
        });
    };

    castleModel.updateRoom = (data, handler) =>{
        var {_id, name, enter, look, left, right, forward, backward} = data;
        var query = {"_id": new ObjectID(_id)};
        var updateCommand = {
            "$set":{
                roomName: name,
                roomEnter: enter,
                roomLook: look,
                roomLeft: left,
                roomRight: right,
                roomForward: forward,
                roomBackward: backward,
            }
        };
        castleCollection.updateOne(
            query,
            updateCommand,
            (err, rslt)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, {"msg":"The update was a success"});
            }
        )
    };

    return castleModel;

}