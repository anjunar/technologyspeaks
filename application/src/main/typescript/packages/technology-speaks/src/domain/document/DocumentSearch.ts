import {Basic, Entity} from "react-ui-simplicity";
import {AbstractSearch} from "react-ui-simplicity";

@Entity("DocumentSearch")
export default class DocumentSearch extends AbstractSearch {

    $type = "DocumentSearch"

    @Basic()
    text : string = ""

}