import {ControlValueAccessor, ValidationErrors} from "@angular/forms";
import PropDescriptor from "../domain/descriptors/PropDescriptor";
import {Directive, inject, input, model, ModelSignal, OnDestroy, OnInit, Signal, signal} from "@angular/core";
import {NodeDescriptor, ObjectDescriptor} from "../domain/descriptors";
import {MetaSignal} from "../meta-signal/meta-signal";
import {AsForm} from "./input/as-form/as-form";
import {Subject, Subscription} from "rxjs";
import Validator from "../domain/descriptors/validators/Validator";

export function value<T>(initial?: T) : ModelSignal<T> {
    const _signal = signal<T | null>(initial ?? null);
    const _subject = new Subject<T>();
    const subscriptions: Subscription[] = [];

    const fn = (() => _signal()) as {
        (): T | null;
        set(value: T): void;
        subscribe(callback: (value: T) => void): Subscription;
        destroy(): void;
    };

    fn.set = (value: T) => {
        _signal.set(value);
        _subject.next(value);
    };

    fn.subscribe = (callback: (value: T) => void) => {
        const sub = _subject.subscribe(callback);
        subscriptions.push(sub);
        return sub;
    };

    fn.destroy = () => {
        subscriptions.forEach(sub => sub.unsubscribe());
        subscriptions.length = 0;
    };


    return fn as unknown as ModelSignal<T>;
}


export interface AsControlValueAccessor extends ControlValueAccessor {

    unRegisterOnChange(fn: any): void

}

@Directive()
export abstract class AsControl {

    onChange: ((name: string, value: any, defaultValue : any, el : HTMLElement) => void)[] = []
    onTouched: ((el : HTMLElement) => void)[] = []

    instance: PropDescriptor

    dirty = model(false)

    errors = model<Validator[]>()

    placeholder = model<string>()

    abstract descriptor: NodeDescriptor

    abstract controlAdded(): void

    abstract setDisabledState(isDisabled: boolean): void

    abstract get model() : ModelSignal<any>
    abstract set model(model : ModelSignal<any>)

    status = signal("INITIAL")

    validators : Validator[] = []

    constructor() {
        this.onChange.push((name, value, defaultValue, el) => {
            if (defaultValue === value) {
                this.dirty.set(false)
                el.classList.add("pristine")
                el.classList.remove("dirty")
            } else {
                this.dirty.set(true)
                el.classList.add("dirty")
                el.classList.remove("pristine")
            }

            this.writeValue(value)
            this.model.set(value)

            let errors = this.validators.filter(validator => ! validator.validate(this));
            this.errors.set(errors)

            if (this.errors().length) {
                this.status.set("INVALID")
                el.classList.add("invalid")
            } else {
                this.status.set("VALID")
                el.classList.remove("invalid")
            }

        })
        this.onTouched.push((el) => {
            el.classList.remove("focus")
        })
    }

    abstract writeValue(obj: any): void

    registerOnChange(fn: (name: string, value: any) => void): void {
        this.onChange.push(fn)
    }

    unRegisterOnChange(fn: (name: string, value: any) => void): void {
        let indexOf = this.onChange.indexOf(fn);
        this.onChange.splice(indexOf, 1)
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched.push(fn)
    }

}

@Directive()
export abstract class AsControlInput extends AsControl implements OnInit, OnDestroy {

    name = input<string>("", {alias: "asName"})

    model = value<any>()

    form = inject(AsControlForm)

    override descriptor: NodeDescriptor

    abstract writeDefaultValue(obj: any): void

    addValidator(validator : Validator) {
        this.validators.push(validator)
    }

    ngOnInit(): void {
        this.form.addControl(this.name(), this)
    }

    ngOnDestroy(): void {
        this.form.removeControl(this.name(), this)
    }

}

@Directive()
export abstract class AsControlForm extends AsControl {

    name = input<string>(null, {alias: 'asName'});

    abstract form: AsControlForm

    abstract addControl(name: string | number, control: AsControl): void

    abstract removeControl(name: string | number, control: AsControl): void
}

@Directive()
export abstract class AsControlSingleForm extends AsControlForm {

    controls: Map<string, AsControl[]> = new Map()

    override descriptor: ObjectDescriptor

    model = model<any>({}, {alias: "asModel"})

    addControl(name: string | number, control: AsControl) {
        let controls = this.controls.get(name as string);
        if (controls) {
            controls.push(control)
        } else {
            this.controls.set(name as string, [control])
        }
        control.descriptor = this.descriptor.properties[name];
        const model = this.model();
        if (model) {
            const metaSignal: MetaSignal<any> = model[name];
            if (metaSignal) {
                control.instance = metaSignal.instance;
                control.model = metaSignal

                let value = metaSignal()
                control.writeValue(value)
                if (control instanceof AsControlInput) {
                    control.writeDefaultValue(value);
                }
            }
        }

        control.controlAdded();
    }

    removeControl(name: string | number, control: AsControl) {
        let controls = this.controls.get(name as string);
        if (controls) {
            let indexOf = controls.indexOf(control);
            controls.splice(indexOf, 1)
        }
    }

}

@Directive()
export abstract class AsControlArrayForm extends AsControlForm {

    model = value([])

    override descriptor: ObjectDescriptor

}