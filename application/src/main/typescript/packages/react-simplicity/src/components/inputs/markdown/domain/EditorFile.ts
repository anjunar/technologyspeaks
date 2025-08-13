import {Basic, Entity} from "../../../../mapper";
import {AbstractEntity} from "../../../../domain/container";

@Entity("EditorFile")
export default class EditorFile extends AbstractEntity {

    $type = "EditorFile"

    @Basic()
    name: string
    @Basic()
    contentType: string
    @Basic()
    lastModified: number
    @Basic()
    data: string
}

