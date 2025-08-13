import User from "./control/User";
import {ActiveObject, Basic, Entity} from "react-ui-simplicity";

@Entity("Application")
export default class Application extends ActiveObject {

    $type = "Application"

    @Basic()
    user: User

}