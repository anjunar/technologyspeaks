import {
    Component,
    contentChild, effect,
    ElementRef,
    inject,
    model,
    ModelSignal,
    signal, TemplateRef, viewChild, ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import {AsControlInput, AsControlValueAccessor} from "../../../directives/as-control";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {value} from "../../../meta-signal/value-signal";
import {AbstractEntity} from "../../../domain/container";

@Component({
    selector: 'as-lazy-select',
    imports: [],
    templateUrl: './as-lazy-select.html',
    styleUrl: './as-lazy-select.css',
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AsLazySelect,
            multi: true
        }, {
            provide: AsControlInput,
            useExisting: AsLazySelect,
        }
    ]
})
export class AsLazySelect extends AsControlInput<AbstractEntity | AbstractEntity[]> implements AsControlValueAccessor {

    override el: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>)
        .nativeElement

    override model: ModelSignal<AbstractEntity | AbstractEntity[]> = model()

    override default = model<AbstractEntity | AbstractEntity[]>()

    multiselect = model(false)

    disabled = model(false)

    open = signal(false)

    window = signal<AbstractEntity[]>([])

    itemTemplate = contentChild(TemplateRef<any>)

    vcr = viewChild("container", {read: ViewContainerRef})

    constructor() {
        super();

        effect(() => {
            this.vcr().clear();
            this.window().forEach((item: AbstractEntity, index: number) => {
                this.vcr().createEmbeddedView(this.itemTemplate(), {$implicit: item }, index);
            });
        });
    }

    override controlAdded(): void {}

    override setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled)
        if (isDisabled) {
            this.el.setAttribute("disabled", "true")
        } else {
            this.el.removeAttribute("disabled")
        }
    }

}
