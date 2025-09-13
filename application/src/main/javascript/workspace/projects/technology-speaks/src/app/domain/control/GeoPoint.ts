import {ActiveObject, Basic, Entity} from "shared";

@Entity("GeoPoint")
export default class GeoPoint extends ActiveObject {

    override $type = "GeoPoint"

    @Basic()
    x : number

    @Basic()
    y : number

}