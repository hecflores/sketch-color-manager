
export class SketchController implements Controllers.ISketchController {
    
    private _sketchService: Services.ISketchService
    private _profileService: Services.IProfileService
    constructor(profileService: Services.IProfileService, sketchService: Services.ISketchService){
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