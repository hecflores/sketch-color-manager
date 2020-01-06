import {ISketchController} from "./controllers/ISketchController"
import {Container, Scope} from "typescript-ioc"
import { SketchController } from "./controllers/SketchController"
import { ProfileService } from "./services/ProfileService"
import { SketchService } from "./services/SketchService"
import { IProfileService } from "./services/IProfileService"
import { ISketchService } from "./services/ISketchService"

// Controllers
Container.bind(ISketchController).to(SketchController).scope(Scope.Singleton)

// Services
Container.bind(IProfileService).to(ProfileService).scope(Scope.Singleton)
Container.bind(ISketchService).to(SketchService).scope(Scope.Singleton)

export default Container