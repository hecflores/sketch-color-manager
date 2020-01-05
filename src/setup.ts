import {Container, Scope} from "typescript-ioc"
import { SketchController } from "./controllers/SketchController"
import { ProfileService } from "./services/ProfileService"
import { SketchService } from "./services/SketchService"

// Controllers
Container.bind(Controllers.ISketchController).to(SketchController).scope(Scope.Singleton)

// Services
Container.bind(Services.IProfileService).to(ProfileService).scope(Scope.Singleton)
Container.bind(Services.ISketchService).to(SketchService).scope(Scope.Singleton)

export default Container