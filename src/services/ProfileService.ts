import * as fs from "fs";
import { ProfileModel } from "../models/ProfileModel";
export class ProfileService implements Services.IProfileService {
    
    model: ProfileModel = new ProfileModel
    context: Sketch.Context;

    /**
     * 
     * @param {Sketch.Context} context
     * @param {(ProfileModel | undefined)} [initialProfile=undefined]
     * @memberof Profile
     */
    constructor(context: Sketch.Context){
        this.context = context
    }
    

    /**
     * Get profile data path
     *
     * @returns string
     * @memberof Profile
     */
    getProfileFilePath(): string{ 
        return this.context.document.path + "/"+ "color-manager-profile.json"
    }

    
    /**
     * Loads latest profile
     *
     * @param {(profile: ProfileModel) => void} callback
     * @memberof Profile
     */
    loadProfile(callback: (profile: ProfileModel) => void){
        fs.readFile(this.getProfileFilePath(), (err, data) => {
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
        fs.writeFile(this.getProfileFilePath(), JSON.stringify(this.model), (err) => {
            if(err){
                throw err.message
            }
            callback()
        })
    }

    

}