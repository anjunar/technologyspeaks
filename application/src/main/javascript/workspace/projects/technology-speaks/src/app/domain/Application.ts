import User from "./control/User";
import {ActiveObject, Basic, Entity, OneToOne} from "shared";

@Entity("Application")
export default class Application extends ActiveObject {

    override $type = "Application"

    @OneToOne({targetEntity : User})
    user: User

}