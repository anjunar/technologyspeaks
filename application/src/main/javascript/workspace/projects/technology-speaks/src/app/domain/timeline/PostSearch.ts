import {AbstractSearch, Basic, Entity} from "shared";
import User from "../control/User";

@Entity("PostSearch")
export default class PostSearch extends AbstractSearch {

    override $type = "PostSearch"

    @Basic()
    user : User

}