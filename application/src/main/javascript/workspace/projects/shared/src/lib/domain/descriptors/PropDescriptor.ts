import {Entity} from "../../mapper";
import Basic from "../../mapper/annotations/Basic";

@Entity("PropDescriptor")
export default class PropDescriptor {
    
    $type = "PropDescriptor"
    
    @Basic()
    visible : boolean

    @Basic()
    writeable : boolean


}