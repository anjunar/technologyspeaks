import {Basic, Entity} from "react-ui-simplicity";
import {AbstractSearch} from "react-ui-simplicity";
import Document from "./Document";

@Entity("RevisionSearch")
export default class RevisionSearch extends AbstractSearch {

    $type = "RevisionSearch"

    @Basic()
    document : Document

}