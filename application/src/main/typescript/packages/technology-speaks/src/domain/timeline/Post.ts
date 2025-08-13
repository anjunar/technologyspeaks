import {AbstractEntity, Basic, EditorModel, Entity} from "react-ui-simplicity";
import User from "../control/User";

@Entity("Post")
export default class Post extends AbstractEntity {

    $type = "Post"

    @Basic()
    user : User

    @Basic()
    editor : EditorModel

}