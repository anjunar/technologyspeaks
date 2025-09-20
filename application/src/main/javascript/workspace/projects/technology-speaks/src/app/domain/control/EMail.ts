import {Basic, Entity, AbstractEntity} from "shared";
import {MetaSignal} from "shared";

@Entity("EMail")
export default class EMail extends AbstractEntity {

    override $type = "EMail"

    @Basic({signal : true})
    value : MetaSignal<string>

}