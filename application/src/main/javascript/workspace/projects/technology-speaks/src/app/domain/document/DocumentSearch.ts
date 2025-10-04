import {Primitive, Entity} from "shared";
import {AbstractSearch} from "shared";

@Entity("DocumentSearch")
export default class DocumentSearch extends AbstractSearch {

    override $type = "DocumentSearch"

    @Primitive()
    text : string = ""

}