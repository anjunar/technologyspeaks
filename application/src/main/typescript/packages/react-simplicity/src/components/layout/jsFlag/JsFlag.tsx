import React, {useEffect, useState} from 'react';

export function JsFlag(properties: JsFlag.Attributes) {

    const {children, showWhenJs} = properties

    const [jsEnabled, setJsEnabled] = useState(false);

    useEffect(() => {
        setJsEnabled(true);
    }, []);

    if (showWhenJs && !jsEnabled) return null;
    if (!showWhenJs && jsEnabled) return null;

    return <>{children}</>;
};

namespace JsFlag {
    export interface Attributes {
        children : React.ReactNode
        showWhenJs: boolean
    }
}

export default JsFlag;