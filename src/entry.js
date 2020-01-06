
import "./setup"
import Container from "./setup"
import {SketchContext} from "./sketch"
import {ISketchController} from "./controllers/ISketchController"
export default function (context) {
    Container.bind(SketchContext).provider({
        get: () => {return context}
    })

    Container.get(ISketchController).OnRun()
}
export function onShutdown(context) {
    Container.bind(SketchContext).provider({
        get: () => {return context}
    })

    Container.get(ISketchController).OnShutdown()
}