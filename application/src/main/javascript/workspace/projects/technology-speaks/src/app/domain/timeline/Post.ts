import {AbstractEntity, Basic, Entity} from "shared";
import User from "../control/User";

@Entity("Post")
export default class Post extends AbstractEntity {

    override $type = "Post"

    @Basic()
    user : User

}