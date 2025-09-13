import {Basic, Entity} from "shared";
import {AbstractSearch} from "shared";
import Document from "./Document";

@Entity("RevisionSearch")
export default class RevisionSearch extends AbstractSearch {

    override $type = "RevisionSearch"

    @Basic()
    document : Document

}