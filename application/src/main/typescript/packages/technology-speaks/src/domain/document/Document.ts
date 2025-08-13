import {AbstractEntity, Basic, Entity, MarkDownEditor, RootNode} from "react-ui-simplicity";
import User from "../control/User";
import {EditorModel} from "react-ui-simplicity";
import HashTag from "../shared/HashTag";

@Entity("Document")
export default class Document extends AbstractEntity {

    $type = "Document"

    @Basic()
    score : number

    @Basic()
    title : string

    @Basic()
    description : string

    @Basic()
    user : User

    @Basic()
    editor : EditorModel

    @Basic()
    revision : number

    @Basic()
    hashTags : HashTag[]

}