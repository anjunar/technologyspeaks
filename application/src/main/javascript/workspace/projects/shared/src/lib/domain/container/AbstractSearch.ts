import ActiveObject from "./ActiveObject";
import Sort from "./Sort";
import Primitive from "../../mapper/annotations/Primitive";
import Collection from "../../mapper/annotations/Collection";

export default abstract class AbstractSearch extends ActiveObject {

    override $type = "abstractSearch"

    @Collection({targetEntity : Sort})
    sort: Sort[]

    @Primitive()
    index: number

    @Primitive()
    limit: number


}