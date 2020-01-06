export abstract class ISketchController{


    /**
     * Executed when option is executed
     *
     * @param {Sketch.Context} context
     * @memberof ISketchController
     */
    abstract OnRun():void


    /**
     * Executed when plugin is shutdown
     *
     * @param {Sketch.Context} context
     * @memberof ISketchController
     */
    abstract OnShutdown():void
}