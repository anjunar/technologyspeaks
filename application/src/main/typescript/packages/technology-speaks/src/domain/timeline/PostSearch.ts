import {AbstractSearch, Basic, Entity} from "react-ui-simplicity";
import User from "../control/User";

@Entity("PostSearch")
export default class PostSearch extends AbstractSearch {

    $type = "PostSearch"

    @Basic()
    user : User

}