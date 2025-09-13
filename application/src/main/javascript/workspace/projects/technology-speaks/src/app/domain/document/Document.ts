import {AbstractEntity, Basic, Entity} from "shared";
import User from "../control/User";
import HashTag from "../shared/HashTag";

@Entity("Document")
export default class Document extends AbstractEntity {

    override $type = "Document"

    @Basic()
    score : number

    @Basic()
    title : string

    @Basic()
    description : string

    @Basic()
    user : User

    @Basic()
    revision : number

    @Basic()
    hashTags : HashTag[]

}