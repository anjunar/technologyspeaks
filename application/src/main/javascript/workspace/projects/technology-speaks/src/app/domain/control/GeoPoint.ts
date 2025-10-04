import {ActiveObject, Primitive, Entity} from "shared";

@Entity("GeoPoint")
export default class GeoPoint extends ActiveObject {

    override $type = "GeoPoint"

    @Primitive()
    x : number

    @Primitive()
    y : number

}