import {AbstractSearch, Primitive, Entity} from "shared";
import Document from "./Document"

@Entity("ChunkSearch")
export default class ChunkSearch extends AbstractSearch {

    override $type = "ChunkSearch"

    @Primitive()
    document : Document

}