import {Entity} from "../../mapper";
import Basic from "../../mapper/annotations/Basic";
import {Link} from "../container";

@Entity("PropertyDescriptor")
export default class PropertyDescriptor {
    
    $type = "PropertyDescriptor"
    
    @Basic()
    visible : boolean

    @Basic()
    writeable : boolean

    @Basic()
    security : Link


}