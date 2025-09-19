import {Basic, Entity, AbstractEntity} from "shared";
import {MetaSignal} from "../../../../../shared/src/lib/meta-signal/meta-signal";

@Entity("EMail")
export default class EMail extends AbstractEntity {

    override $type = "EMail"

    @Basic({signal : true})
    value : MetaSignal<string>

}