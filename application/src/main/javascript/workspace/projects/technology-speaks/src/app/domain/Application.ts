import User from "./control/User";
import {ActiveObject, Basic, Entity} from "shared";

@Entity("Application")
export default class Application extends ActiveObject {

    override $type = "Application"

    @Basic()
    user: User

}