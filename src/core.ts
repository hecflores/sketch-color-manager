import fs from "fs";
var sketch = require('sketch');
export function getProfileFilePath(){
    var document = sketch.getSelectedDocument()
    return document.path
}
export function readProfile(callback: (data: string) => void){
    
}