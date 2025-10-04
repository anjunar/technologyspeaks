import {Entity} from "../../mapper";
import Primitive from "../../mapper/annotations/Primitive";
import {Link} from "../container";

@Entity("PropertyDescriptor")
export default class PropertyDescriptor {
    
    $type = "PropertyDescriptor"
    
    @Primitive()
    visible : boolean

    @Primitive()
    writeable : boolean

    @Primitive()
    security : Link


}