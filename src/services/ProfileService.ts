
import { ProfileModel } from "../models/ProfileModel";
import { IProfileService } from "./IProfileService";
import { SketchContext } from "../sketch";
import { Inject } from "typescript-ioc";
const fs = require("fs")

export class ProfileService implements IProfileService {
    
    model: ProfileModel = new ProfileModel
    context: SketchContext;

    /**
     * 
     * @param {Sketch.Context} context
     * @param {(ProfileModel | undefined)} [initialProfile=undefined]
     * @memberof Profile
     */
    constructor(@Inject context: SketchContext){
        this.context = context
        
    }
    

    /**
     * Get profile data path
     *
     * @returns string
     * @memberof Profile
     */
    getProfileFilePath(): string{ 
        if(!this.context.document){
            throw new Error("No document found in context")
        }
        console.log(this.context.document)
        return this.context.document.path + "/"+ "color-manager-profile.json"
    }

    
    /**
     * Loads latest profile
     *
     * @param {(profile: ProfileModel) => void} callback
     * @memberof Profile
     */
    loadProfile(callback: (profile: ProfileModel) => void){
        console.log(fs);
        fs.readFile(this.getProfileFilePath(), (err:any, data:any) => {
            if(err){
                throw err.message
            }

            this.model = JSON.parse(data.toString())
            callback(this.model)
        })
    }


    /**
     * Saves current profile 
     *
     * @param {() => void} callback
     * @memberof Profile
     */
    saveProfile(callback: () => void){
        console.log(fs);
        fs.writeFile(this.getProfileFilePath(), JSON.stringify(this.model), (err:any) => {
            if(err){
                throw err.message
            }
            callback()
        })
    }

    

}