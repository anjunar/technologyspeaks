import {AbstractEntity, Basic, Entity} from "react-ui-simplicity";

@Entity("Chunk")
export default class Chunk extends AbstractEntity {

    $type = "Chunk"

    @Basic()
    title : string

    @Basic()
    content : string

}