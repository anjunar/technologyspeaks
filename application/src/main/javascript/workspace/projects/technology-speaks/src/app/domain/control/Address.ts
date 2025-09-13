import GeoPoint from "./GeoPoint";
import {Basic, Entity, AbstractEntity} from "shared";

@Entity("Address")
export default class Address extends AbstractEntity {

    override $type = "Address"

    @Basic()
    street: string

    @Basic()
    number: string

    @Basic()
    zipCode: string

    @Basic()
    country: string

    @Basic()
    point : GeoPoint

}