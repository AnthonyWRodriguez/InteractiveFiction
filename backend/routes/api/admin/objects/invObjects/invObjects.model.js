var ObjectID = require('mongodb').ObjectID;

module.exports = (db) =>{
    objectsModel = {};
    var objectsCollection = db.collection("objectsInv");


    var objectTemplate = {
        objectName: "",
        objectDesc: "",//examine item
        objectType: "",//MAG, ATK, HEAL, DEF, KEY(as in important), etc
        objectValue: "",//Attack output, heal output, defense output, etc
        objectWeight: "",//only important in weapons
        objectUse: "",
        objectEquip: "",
        objectUnequip: "",
        objectDrop: "",
        objectGrab: "",
        objectHelp: ""
    };

    objectsModel.getAllObjects = (handler)=>{
        return objectsCollection.find({}).toArray(handler);
    };

    objectsModel.newObject = (data, handler)=>{
        var {name, desc, type, value, weight, use, equip, unequip, drop, grab, help} = data;
        var object = Object.assign(
            {},
            objectTemplate,
            {
                objectName: name,
                objectDesc: desc,
                objectType: type,
                objectValue: value,
                objectWeight: weight,
                objectUse: use,
                objectEquip: equip,
                objectUnequip: unequip,
                objectDrop: drop,
                objectGrab: grab,
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