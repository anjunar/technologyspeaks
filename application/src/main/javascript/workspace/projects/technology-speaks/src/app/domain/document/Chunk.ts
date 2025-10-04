import {AbstractEntity, Primitive, Entity} from "shared";

@Entity("Chunk")
export default class Chunk extends AbstractEntity {

    override $type = "Chunk"

    @Primitive()
    title : string

    @Primitive()
    content : string

}