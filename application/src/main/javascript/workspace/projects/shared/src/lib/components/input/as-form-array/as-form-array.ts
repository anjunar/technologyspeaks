import {
    AfterContentInit,
    Component,
    contentChild,
    ElementRef,
    inject,
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
import {AsForm} from "../../../directives/input/as-form/as-form";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {AsArrayForm} from "../as-array-form/as-array-form";
import {AsIcon} from "../../layout/as-icon/as-icon";

@Component({
    selector: 'form-array',
    imports: [AsIcon],
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
            provide: AsControlForm,
            useExisting: AsFormArray
        }
    ]
})
export class AsFormArray extends AsControlArrayForm<any[]> implements AsControlValueAccessor, AfterContentInit, OnInit, OnDestroy {

    el = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>).nativeElement

    itemTemplate = contentChild(TemplateRef<any>)

    form = inject(AsForm)

    controls = signal<AsArrayForm[]>([])

    newInstance: Function

    vcr = viewChild("container", {read: ViewContainerRef})

    isDisabled = model(false, {alias: "disabled"})

    addControl(name: string | number, control: AsControl<any>): void {
        if (control instanceof AsArrayForm) {
            control.writeValue(this.model()[name as number]);
            this.controls().splice(name as number, 0, control)
            control.controlAdded();
        }
    }

    removeControl(name: string | number, control: AsControl<any>): void {
        this.controls().splice(name as number, 1)
    }

    override markAsNoError() {
        this.dirty.set(false)
        this.controls().forEach((control) => control.markAsNoError())
    }

    override markAsPristine() {
        this.dirty.set(false)
        this.controls().forEach((control) => control.markAsPristine())
    }

    override markAsDirty() {
        this.dirty.set(false)
        this.controls().forEach((control) => control.markAsDirty())
    }

    ngOnInit(): void {
        this.form.addControl(this.name(), this)
    }

    ngOnDestroy(): void {
        this.form.removeControl(this.name(), this)
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
        let ctor = this.newInstance
        this.model.update((arr: any[]) => [...arr, this.form.model().$instance(ctor)]);
        this.form.model()[this.name()] = this.model()
        this.renderItems();
    }

    removeItem(index: number) {
        this.model.update((arr: any[]) => arr.filter((_: any, i: number) => i !== index));
        this.form.model()[this.name()] = this.model()
        this.renderItems();
    }

    private renderItems() {
        if (!this.itemTemplate()) return;

        this.vcr().clear();
        this.model().forEach((item: any, index: number) => {
            this.vcr().createEmbeddedView(this.itemTemplate(), {$implicit: item, index}, index);
        });
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled.set(isDisabled)
        this.controls().forEach(c => {
            c.setDisabledState(isDisabled);
        });
    }

    controlAdded(): void {
    }

}
