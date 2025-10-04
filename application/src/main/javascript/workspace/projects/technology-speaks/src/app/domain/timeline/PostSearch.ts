import {AbstractSearch, Primitive, Entity} from "shared";
import User from "../control/User";

@Entity("PostSearch")
export default class PostSearch extends AbstractSearch {

    override $type = "PostSearch"

    @Primitive()
    user : User

}