import {AbstractEntity, Basic, Entity} from "shared";
import {MetaSignal} from "shared";

@Entity("Address")
export default class Address extends AbstractEntity {

    override $type = "Address"

    @Basic({signal: true})
    street: MetaSignal<string>

    @Basic({signal: true})
    number: MetaSignal<string>

    @Basic({signal: true})
    zipCode: MetaSignal<string>

    @Basic({signal: true})
    country: MetaSignal<string>

}