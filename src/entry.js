
import "./setup"
import Container from "./setup"
import * as sketch from "./sketch"

export default function onRun(context) {
    Container.bind(sketch).provider({
        get: () => {return context}
    })

    Container.get(Controllers.ISketchController).onRun()
}
export function onShutdown(context) {
    Container.bind(Sketch.Context).provider({
        get: () => {return context}
    })

    Container.get(Controllers.ISketchController).onShutdown()
}