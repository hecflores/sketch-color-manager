import * as fs from "fs";
export class Profile {
    
    _context: Sketch.Context;
    constructor(context: Sketch.Context){
        this._context = context
    }
    getProfileFilePath() { 
        var document = this._context.document
        return document.path
    }
    readProfile(callback: (data: string) => void){
        fs.readFile(this.getProfileFilePath(), (err, data) => {
            if(err){
                throw err.message
            }

            callback(data.toString())
        })
    }
}