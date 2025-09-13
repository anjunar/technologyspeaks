import {AbstractEntity, Basic, EditorModel, Entity} from "shared";

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