import {AbstractEntity, Basic, Entity} from "shared";

@Entity("Chunk")
export default class Chunk extends AbstractEntity {

    $type = "Chunk"

    @Basic()
    title : string

    @Basic()
    content : string

}