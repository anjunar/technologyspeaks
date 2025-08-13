import {Basic, Entity} from "../../../../mapper";
import {AbstractEntity} from "../../../../domain/container";
import EditorFile from "./EditorFile";
import {Root} from "mdast";
import Change from "./Change";

@Entity("Editor")
export default class EditorModel extends AbstractEntity {

    $type = "Editor"

    @Basic()
    files: EditorFile[] = []

    ast: Root

    @Basic()
    markdown : string

    @Basic()
    changes : Change[]

    @Basic()
    get json() {
        return JSON.stringify(this.ast)
    }

    set json(value) {
        this.ast = JSON.parse(value)
    }

}
