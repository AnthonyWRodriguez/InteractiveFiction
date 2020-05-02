var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    objectsModel = {};
    var objectsCollection = db.collection("objects");

    var objectTemplate = {
        objectName: ""
    };

    objectsModel.getAllObjects = (handler) =>{
        return objectsCollection.find({}).toArray(handler);
    }
    
    return objectsModel;
}