var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    castleModel = {};
    var castleCollection = db.collection("castle");

    var roomTemplate = {
        look: "",
        left: "",
        right: "",
        forward: "",
        backward: "",
    };

    castleModel.getAllRooms = (handler) => {
        return castleCollection.find({}).toArray(handler);
    };

    return castleModel;

}