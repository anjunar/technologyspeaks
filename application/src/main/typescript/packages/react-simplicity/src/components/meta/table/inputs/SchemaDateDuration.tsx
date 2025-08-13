import Input from "../../../inputs/input/Input";
import React, {useState} from "react";
import DateDuration from "../../../../domain/types/DateDuration";
import {Temporal, TemporalAmount} from "@js-joda/core";
import NodeDescriptor from "../../../../domain/descriptors/NodeDescriptor";

function SchemaDateDuration (properties : SchemaDateDuration.Attributes) {

    const {schema, value, onChange} = properties

    const [state, setState] = useState((value && value.from && value.to) ? value : new DateDuration(null, null))

    const onChangeFromHandler = (event : Temporal | TemporalAmount | string | number | boolean) => {
        if (typeof event === "string") {
            let newVar = new DateDuration(event, state.to);
            setState(newVar)
            onChange({target : {value : newVar}})
        }
    }

    const onChangeToHandler = (event : Temporal | TemporalAmount | string | number | boolean) => {
        if (typeof event === "string") {
            let newVar = new DateDuration(state.from, event);
            setState(newVar)
            onChange({target : {value : newVar}})
        }
    }


    return (
        <table>
            <tbody>
            <tr>
                <td style={{height : "unset"}}>from</td>
                <td style={{height : "unset"}}><Input type={"date"} value={state.from} onChange={onChangeFromHandler}/></td>
            </tr>
            <tr>
                <td style={{height : "unset"}}>to</td>
                <td style={{height : "unset"}}><Input type={"date"} value={state.to} onChange={onChangeToHandler}/></td>
            </tr>
            </tbody>
        </table>
    )

}

namespace SchemaDateDuration {
    export interface Attributes {
        schema : NodeDescriptor
        value : any
        onChange : any
    }
}

export default SchemaDateDuration