import {AbstractEntity, Primitive, Entity} from "shared";
import User from "../control/User";
import HashTag from "../shared/HashTag";

@Entity("Document")
export default class Document extends AbstractEntity {

    override $type = "Document"

    @Primitive()
    score : number

    @Primitive()
    title : string

    @Primitive()
    description : string

    @Primitive()
    user : User

    @Primitive()
    revision : number

    @Primitive()
    hashTags : HashTag[]

}