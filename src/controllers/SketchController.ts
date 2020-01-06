import { ISketchController } from "./ISketchController"
import { ISketchService } from "../services/ISketchService"
import { IProfileService } from "../services/IProfileService"
import {Inject} from "typescript-ioc";

export class SketchController implements ISketchController {
    
    private _sketchService: ISketchService
    private _profileService: IProfileService
    constructor(@Inject profileService: IProfileService, 
                @Inject sketchService: ISketchService){
        this._sketchService = sketchService
        this._profileService = profileService
    }
    
    OnRun(): void {
        this._profileService.loadProfile((_profile) => {
            this._sketchService.CreateWebBrowserWindow()
        })
    }    
    
    
    OnShutdown(): void {
        this._profileService.saveProfile(() => {
            
        })
    }

    
}