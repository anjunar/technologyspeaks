import {Entity} from "../../mapper";
import Basic from "../../mapper/annotations/Basic";
import {Link} from "../container";

@Entity("PropDescriptor")
export default class PropDescriptor {
    
    $type = "PropDescriptor"
    
    @Basic()
    visible : boolean

    @Basic()
    writeable : boolean

    @Basic()
    security : Link


}