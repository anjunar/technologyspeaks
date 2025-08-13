import "./Input.css"
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState} from "react"
import {AsyncValidator, Email, Max, MaxLength, Min, MinLength, Model, Pattern, Required, Validator} from "../../shared/Model"
import {Duration, LocalDate, LocalDateTime, LocalTime, Temporal, TemporalAmount} from "@js-joda/core";
import {format} from "../../shared/DateTimeUtils";
import {useInput} from "../../../hooks/UseInputHook";

export const Input = forwardRef<{ selectionStart: number }, Input.Attributes>((properties : Input.Attributes, ref) => {

    const {
        asyncValidators = [],
        autoComplete,
        disabled,
        dynamicWidth = false,
        email,
        max,
        maxLength,
        min,
        minLength,
        name = "default",
        onBlur,
        onChange,
        onFocus,
        onModel,
        past,
        pattern,
        required,
        size,
        standalone = false,
        style,
        subType,
        type,
        validators = [],
        value,
        ...rest
    } = properties

    let [model, state, setState] = useInput(name, value, standalone, type);

    const [hasFocus, setHasFocus] = useState(false);

    useEffect(() => {
        const checkFocus = () => {
            setHasFocus(document.activeElement === input.current);
        };

        checkFocus();

        window.addEventListener('focus', checkFocus, true);
        window.addEventListener('blur', checkFocus, true);

        return () => {
            window.removeEventListener('focus', checkFocus, true);
            window.removeEventListener('blur', checkFocus, true);
        };
    }, []);

    const input = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        get selectionStart() : number {
            return input.current?.selectionStart
        }
    }));

    const onInputHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        let target = event.target

        let converted = parseValue(target);

        setState(converted)

        if (onChange) {
            onChange(converted)
        }

        if (onModel) {
            onModel(model)
        }

    }, [])

    useLayoutEffect(() => {

        if (required) {
            model.addValidator(new Required())
        }
        if (min) {
            // @ts-ignore
            model.addValidator(new Min(min))
        }
        if (max) {
            // @ts-ignore
            model.addValidator(new Max(max))
        }
        if (minLength) {
            model.addValidator(new MinLength(minLength))
        }
        if (maxLength) {
            model.addValidator(new MaxLength(maxLength))
        }
        if (pattern) {
            model.addValidator(new Pattern(pattern))
        }

        if (type === "email") {
            model.addValidator(new Email())
        }

        for (const asyncValidator of asyncValidators) {
            model.addAsyncValidator(asyncValidator)
        }

        for (const validator of validators) {
            model.addValidator(validator)
        }

        // For form validation -> Error messages
        model.callbacks.push((validate: boolean) => {
            if (onModel) {
                onModel(model)
            }
        })

        if (onModel) {
            onModel(model)
        }

        let element = input.current;

        element.addEventListener("blur", () => {
            setTimeout(() => {
                if (dynamicWidth) {
                    element.style.width = calculateWidth(type)
                }
            },300)
        })

        function getElementTextWidth(text: string, style?: any) {
            const span = document.createElement('span');
            span.style.visibility = 'hidden';
            span.style.whiteSpace = 'nowrap';
            span.style.font = style?.font || '16px Helvetica';
            document.body.appendChild(span);

            span.textContent = text;
            const width = span.offsetWidth;
            document.body.removeChild(span);

            return width;
        }

        function calculateWidth(type: string) {
            let ratio = 1
            if (element.value.length === 0 && type === "text") {
                return `${ratio}ch`
            }
            switch (type) {
                case "number" :
                    return 6 + getElementTextWidth(element.value) + "px"
                case "duration" :
                    return 6 + getElementTextWidth(element.value) + "px"
                case "date" :
                    return `${3 + element.value.length * ratio}ch`;
                case "datetime-local" :
                    return `${4 + element.value.length * ratio}ch`;
                case "time" :
                    return `9ch`;
                default :
                    return getElementTextWidth(element.value) + "px"
            }
        }

        if (dynamicWidth) {
            element.addEventListener('input', () => {
                element.style.width = calculateWidth(type);
            });

            element.style.width = calculateWidth(type)
        }

    }, [])

    useLayoutEffect(() => {
        if (onModel) {
            onModel(model)
        }
    }, [value, model.dirty]);

    if (typeof window === "undefined") {
        if (onModel) {
            onModel(model)
        }
    }

    function parseValue(target: HTMLInputElement) {
        try {
            switch (type) {
                case "checkbox" :
                    return target.checked
                case "number" :
                    return target.valueAsNumber
                case "datetime-local" : {
                    if (subType) {
                        let localTime = LocalTime.parse(target.value);
                        let localDateTime = state as LocalDateTime;
                        return LocalDateTime.of(localDateTime.toLocalDate(), localTime)
                    }
                    return LocalDateTime.parse(target.value)
                }
                case "date" :
                    return LocalDate.parse(target.value)
                case "time" :
                    return LocalTime.parse(target.value)
                case "duration" :
                    return Duration.ofMinutes(target.valueAsNumber)
                default :
                    return target.value
            }
        } catch (e) {
            return ""
        }
    }

    function formatValue(): string | number | readonly string[] {
        if (state === undefined || state === null || state === "") {
            return ""
        }
        switch (type) {
            case "checkbox":
                return state.toString()
            case "datetime-local" : {
                let localDateTime = state as LocalDateTime;
                if (subType) {
                    return localDateTime.toLocalTime().toJSON()
                }
                return localDateTime.toJSON();
            }
            case "date" :
                return (state as LocalDate).toJSON();
            case "time" :
                return format((state as LocalTime), "HH:mm")
            case "duration" :
                return (state as Duration).toMinutes()
            default :
                return state as string
        }
    }

    return (
        <input
            autoComplete={autoComplete}
            checked={typeof state === "boolean" ? state : false}
            className={`input${typeof state === "boolean" ? state ? " checked" : " unchecked" : ""}${model.dirty ? " dirty" : " pristine"}${model.valid ? " valid" : " error"}${hasFocus ? " focus" : " blur"}`}
            disabled={disabled}
            name={name}
            onBlur={onBlur}
            onChange={onInputHandler}
            onFocus={onFocus}
            ref={input}
            style={style}
            type={subType || type}
            value={formatValue()}
            {...rest}
        />
    )


})

namespace Input {
    // @ts-ignore
    export interface Attributes extends React.InputHTMLAttributes<HTMLInputElement> {
        asyncValidators?: AsyncValidator[],
        dynamicWidth?: boolean
        email?: boolean,
        onBlur? : () => void
        onChange?: (value: Temporal | TemporalAmount | string | number | boolean) => void
        onModel?: (value: Model) => void
        past?: boolean,
        standalone?: boolean
        subType?: string
        validators?: Validator[]
        value?: Temporal | TemporalAmount | string | number | boolean
        ref? : React.RefObject<HTMLInputElement>
    }
}

export default Input