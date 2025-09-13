import {ActiveObject, Basic, Entity} from "shared";

@Entity("GeoPoint")
export default class GeoPoint extends ActiveObject {

    $type = "GeoPoint"

    @Basic()
    x : number

    @Basic()
    y : number

}