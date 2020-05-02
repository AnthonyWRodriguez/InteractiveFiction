var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    objectsModel = {};

    var objectsCollection = db.collection("objectsEnv");

    var objectTemplate = {
        objectName: "",
        objectDesc: "",
        objectPush: "",
        objectPull: "",
        objectRead: "",
        objectOpen: "",
        objectClose: "",
        objectClimb: "",
        objectBurn: "",
        objectShoot: "",
        objectShatter: "",
        objectInteracted: false,
        objectHelp: ""
    };

    objectsModel.getAllObjects = (handler)=>{
        return objectsCollection.find({}).toArray(handler);
    };

    objectsModel.newObject = (data, handler)=>{
        var {name, desc, push, pull, read, open, close, climb, burn, shoot, shatter, help} = data;
        var object = Object.assign(
            {},
            objectTemplate,
            {
                objectName: name,
                objectDesc: desc,
                objectPush: push,
                objectPull: pull,
                objectRead: read,
                objectOpen: open,
                objectClose: close,
                objectClimb: climb,
                objectBurn: burn,
                ibjectShoot: shoot,
                objectShatter: shatter,
                objectInteracted: false,
                objectHelp: help
            }
        );
        objectsCollection.insertOne(object, (err, object)=>{
                if(err){
                    console.log(err);
                    return handler(err, null);
                }
                return handler(null, object.ops);
            }
        )
    };

        
    return objectsModel;
}