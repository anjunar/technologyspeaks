import {AbstractSearch, Basic, Entity} from "shared";
import Document from "./Document"

@Entity("ChunkSearch")
export default class ChunkSearch extends AbstractSearch {

    $type = "ChunkSearch"

    @Basic()
    document : Document

}