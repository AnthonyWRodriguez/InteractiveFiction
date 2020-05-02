var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    castleModel = {};
    var castleCollection = db.collection("castle");

    var roomTemplate = {
        roomName: "",
        roomEnter: "",
        roomLook: "",
        roomLeft: "",
        roomRight: "",
        roomForward: "",
        roomBackward: "",
        roomDropped: [],
        roomObjects: []
    };

    castleModel.getAllRooms = (handler) => {
        return castleCollection.find({}).toArray(handler);
    };

    castleModel.newRoom = (data, handler) =>{
        var {name, enter, look, left, right, forward, backward} = data;
        var room = Object.assign(
            {},
            roomTemplate,
            {
                roomName: name,
                roomEnter: enter,
                roomLook: look,
                roomLeft: left,
                roomRight: right,
                roomForward: forward,
                roomBackward: backward,
                roomDropped: [],
                roomObjects: []
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

    return castleModel;

}