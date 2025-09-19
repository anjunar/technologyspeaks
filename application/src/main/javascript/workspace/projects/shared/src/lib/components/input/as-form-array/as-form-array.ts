import {
    AfterContentInit,
    Component,
    contentChild,
    inject,
    input,
    OnInit,
    signal,
    TemplateRef,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import {AsControl, AsControlArrayForm, AsControlValueAccessor} from "../../../directives/as-control";
import {CollectionDescriptor} from "../../../domain/descriptors";
import {AsForm} from "../../../directives/input/as-form/as-form";

@Component({
    selector: 'form-array',
    imports: [],
    templateUrl: './as-form-array.html',
    styleUrl: './as-form-array.css',
    encapsulation: ViewEncapsulation.None
})
export class AsFormArray extends AsControlArrayForm implements AsControlValueAccessor, AfterContentInit, OnInit {

    formName = input<string>(null, {alias: 'name'});

    itemTemplate = contentChild(TemplateRef<any>)

    form = inject(AsForm)

    model = signal([])

    vcr = inject(ViewContainerRef)

    override valueAccessor: AsControlValueAccessor = this;

    insertControl(index: number, control: AsForm) {
        control.descriptor = this.descriptor;
        control.valueAccessor.writeValue(this.model()[index] ?? null);
        this.control.insert(index, control.control);
        control.controlAdded();
    }

    removeControlAt(index: number, control: AsControl) {
    }

    ngOnInit(): void {
        this.form.addControl(this.formName(), this)
        this.descriptor = (this.form.descriptor.properties[this.formName()] as CollectionDescriptor).items
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

    writeDefaultValue(obj: any): void {
        this.writeValue(obj);
    }

    addItem(defaultValue: any = {value: ''}) {
        this.model.update(arr => [...arr, defaultValue]);
        this.renderItems();
    }

    removeItem(index: number) {
        this.model.update(arr => arr.filter((_, i) => i !== index));
        this.renderItems();
    }

    private renderItems() {
        if (!this.itemTemplate()) return;

        this.vcr.clear();
        this.model().forEach((item, index) => {
            this.vcr.createEmbeddedView(this.itemTemplate(), {$implicit: item, index}, index);
        });
    }

    setDisabledState(isDisabled: boolean): void {
    }

    controlAdded(): void {
    }

    override get value() {
        return this.model();
    }
}
