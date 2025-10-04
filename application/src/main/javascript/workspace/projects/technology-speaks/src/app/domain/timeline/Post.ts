import {AbstractEntity, Primitive, Entity} from "shared";
import User from "../control/User";

@Entity("Post")
export default class Post extends AbstractEntity {

    override $type = "Post"

    @Primitive()
    user : User

}