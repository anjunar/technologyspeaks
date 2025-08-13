import React from "react";

import SchemaLazySelect from "../inputs/SchemaLazySelect";
import SchemaInput from "../inputs/SchemaInput";
import SchemaDateDuration from "./inputs/SchemaDateDuration";
import NodeDescriptor from "../../../domain/descriptors/NodeDescriptor";
import Validable from "../../../domain/descriptors/Validable";

function SchemaFactory(properties: SchemaFactory.Attributes) {

    const {schema, value, onChange} = properties

    switch (schema.widget) {
        case "none" :
            return <div>Kein Filter hier</div>
        case "date" :
            return <SchemaDateDuration schema={schema} value={value} onChange={onChange}/>
        case "lazy-select" :
            return <SchemaLazySelect style={{border: "1px solid var(--color-background-secondary)"}}
                                     schema={schema} value={value} onChange={onChange}/>
        case "lazy-multi-select" :
            return <SchemaLazySelect style={{border: "1px solid var(--color-background-secondary)"}}
                                     schema={schema} value={value} onChange={onChange} multiSelect={true}/>
        default :
            return <SchemaInput style={{border: "1px solid var(--color-background-secondary)"}}
                                value={value} schema={schema} onChange={onChange}/>
    }

}

namespace SchemaFactory {
    export interface Attributes {
        schema: NodeDescriptor & Validable
        value: any
        onChange: any
    }
}

export default SchemaFactory