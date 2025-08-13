import React, { useContext, useEffect, useState } from "react";
import { MarkDownContext } from "../../MarkDownEditor";
import {HeadingCommand} from "../../commands/SelectCommand";

function FormatSelect(props: FormatSelect.Attributes) {
    const { children, command, style } = props;

    const [value, setValue] = useState("p");
    const [disabled, setDisabled] = useState(true);

    const { model, textAreaRef, cursor, updateAST } = useContext(MarkDownContext);

    useEffect(() => {
        setDisabled(! command.isActive(textAreaRef.current, cursor))
    }, [cursor]);

    useEffect(() => {
        command.execute(textAreaRef.current, cursor, value, updateAST);
    }, [value]);

    return (
        <select disabled={disabled} value={value} style={style} onChange={event => setValue(event.target.value)}>
            {children}
        </select>
    );
}

namespace FormatSelect {
    export interface Attributes {
        children: React.ReactNode[];
        command?: HeadingCommand;
        style?: React.CSSProperties;
    }
}

export default FormatSelect;
