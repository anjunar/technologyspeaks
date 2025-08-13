import {AbstractSearch, Basic, Entity} from "react-ui-simplicity";
import Document from "./Document"

@Entity("ChunkSearch")
export default class ChunkSearch extends AbstractSearch {

    $type = "ChunkSearch"

    @Basic()
    document : Document

}