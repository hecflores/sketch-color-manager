const fs = require("@skpm/fs")

module.exports.existsSync = fs.existsSync;
module.exports.readFile = function(path, callback){
    try{
        var data = fs.readFileSync(path)
        callback(undefined, data)
    }
    catch(e){
        callback(e, undefined)
    }
}