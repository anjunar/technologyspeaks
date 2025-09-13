import {Basic, Entity} from "shared";
import {AbstractSearch} from "shared";

@Entity("DocumentSearch")
export default class DocumentSearch extends AbstractSearch {

    $type = "DocumentSearch"

    @Basic()
    text : string = ""

}