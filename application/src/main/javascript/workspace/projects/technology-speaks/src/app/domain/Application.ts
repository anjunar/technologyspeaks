import User from "./control/User";
import {ActiveObject, Primitive, Entity, Reference} from "shared";

@Entity("Application")
export default class Application extends ActiveObject {

    override $type = "Application"

    @Reference({targetEntity : User})
    user: User

}