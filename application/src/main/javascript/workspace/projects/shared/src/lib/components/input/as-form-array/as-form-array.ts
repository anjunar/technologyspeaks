import {
    AfterContentInit,
    Component,
    contentChild,
    inject,
    input,
    model,
    OnDestroy,
    OnInit,
    signal,
    TemplateRef,
    viewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import {AsControl, AsControlArrayForm, AsControlForm, AsControlValueAccessor} from "../../../directives/as-control";
import {CollectionDescriptor} from "../../../domain/descriptors";
import {AsForm} from "../../../directives/input/as-form/as-form";
import {Constructor} from "../../../domain/container/ActiveObject";
import {NG_VALUE_ACCESSOR, NgControl} from "@angular/forms";
import {AsIcon} from "../../layout/as-icon/as-icon";

@Component({
    selector: 'form-array',
    imports: [
        AsIcon
    ],
    templateUrl: './as-form-array.html',
    styleUrl: './as-form-array.css',
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AsFormArray,
            multi: true,
        },
        {
            provide: NgControl,
            useExisting: AsFormArray,
            multi: true
        },
        {
            provide: AsControlForm,
            useExisting: AsFormArray
        }
    ]
})
export class AsFormArray extends AsControlArrayForm implements AsControlValueAccessor, AfterContentInit, OnInit, OnDestroy {

    itemTemplate = contentChild(TemplateRef<any>)

    form = inject(AsForm)

    model = signal([])

    newInstance = input.required<Constructor<any>>()

    vcr = viewChild("container", {read: ViewContainerRef})

    isDisabled = model(false, {alias : "disabled"})

    addControl(name: string | number, control: AsControl): void {
        control.descriptor = this.descriptor;
        control.valueAccessor.writeValue(this.model()[name as number] ?? null);
        this.control.insert(name as number, control.control);
        control.controlAdded();
    }

    removeControl(name: string | number, control: AsControl): void {
        this.control.removeAt(name as number)
    }

    ngOnInit(): void {
        this.form.addControl(this.formName(), this)
        this.descriptor = (this.form.descriptor.properties[this.formName()] as CollectionDescriptor).items
    }

    ngOnDestroy(): void {
        this.form.removeControl(this.formName(), this)
    }

    ngAfterContentInit() {
        this.renderItems();
    }

    writeValue(obj: any): void {
        if (Array.isArray(obj)) {
            this.model.set([...obj]);
        } else {
            this.model.set([]);
        }
        this.renderItems();
    }

    addItem() {
        let ctor = this.newInstance()
        this.model.update(arr => [...arr, this.form.model().$instance(ctor)]);
        this.form.model()[this.formName()] = this.model()
        this.renderItems();
    }

    removeItem(index: number) {
        this.model.update(arr => arr.filter((_, i) => i !== index));
        this.form.model()[this.formName()] = this.model()
        this.renderItems();
    }

    private renderItems() {
        if (!this.itemTemplate()) return;

        this.vcr().clear();
        this.model().forEach((item, index) => {
            this.vcr().createEmbeddedView(this.itemTemplate(), {$implicit: item, index}, index);
        });
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled.set(isDisabled)
        this.control.controls.forEach(c => {
            if ((c as any).valueAccessor) {
                (c as any).valueAccessor.setDisabledState(isDisabled);
            }
        });
    }

    override get value() {
        return this.model();

    }

    controlAdded(): void {
    }

    override valueAccessor: AsControlValueAccessor = this;

}
