import {AbstractEntity, Basic, EditorModel, Entity} from "react-ui-simplicity";

@Entity("Revision")
export default class Revision extends AbstractEntity {

    $type = "Revision"

    @Basic()
    title : string

    @Basic()
    revision : number

    @Basic()
    editor : EditorModel

}