import {
    Component,
    contentChild,
    effect,
    ElementRef,
    inject,
    model,
    ModelSignal, OnDestroy, OnInit, PLATFORM_ID,
    signal,
    TemplateRef,
    viewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import {AsControlInput, AsControlValueAccessor} from "../../../directives/as-control";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {AbstractEntity, Table} from "../../../domain/container";
import {Observable} from "rxjs";
import {Mapper} from "../../../mapper";
import {value} from "../../../meta-signal/value-signal";
import {isPlatformBrowser} from "@angular/common";

export interface AsLazyQuery {
    search: string
    index: number
    limit: number
}

export interface AsLazyLoader {
    (query: AsLazyQuery): Observable<Object>
}

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
export class AsLazySelect extends AsControlInput<AbstractEntity | AbstractEntity[]> implements AsControlValueAccessor, OnInit, OnDestroy {

    override el: HTMLElement = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>)
        .nativeElement

    override model: ModelSignal<AbstractEntity | AbstractEntity[]> = model()

    override default = model<AbstractEntity | AbstractEntity[]>()

    index = signal(0)

    limit = signal(5)

    search = signal("")

    loader = model<AsLazyLoader>()

    multiselect = model(false)

    disabled = model(false)

    open = signal(false)

    window = signal<AbstractEntity[]>([])

    itemTemplate = contentChild(TemplateRef<any>)

    vcr = viewChild("container", {read: ViewContainerRef})

    platformId = inject(PLATFORM_ID)

    overlayClose = () => {
        this.open.set(false)
        this.focus.set(false)
    }

    constructor() {
        super();

        effect(() => {
            if (this.vcr()) {
                this.vcr().clear();
                this.window().forEach((item: AbstractEntity, index: number) => {
                    this.vcr().createEmbeddedView(this.itemTemplate(), {$implicit: item}, index);
                });
            }
        });
    }

    override ngOnInit() {
        super.ngOnInit();

        if (isPlatformBrowser(this.platformId)) {
            window.addEventListener("click", this.overlayClose)
        }
    }

    override ngOnDestroy() {
        super.ngOnDestroy();

        if (isPlatformBrowser(this.platformId)) {
            window.removeEventListener("click", this.overlayClose)
        }
    }

    openOverlay() {
        this.loader()({index: this.index(), limit: this.limit(), search: this.search()})
            .subscribe(value => {
                let table : Table<any> = Mapper.domain(value)
                this.focus.set(true)
                this.open.set(true)
                this.window.set(table.rows)
            })
    }

    clickOverlay(event : MouseEvent) {
        event.preventDefault()
        event.stopPropagation()
    }

    override controlAdded(): void {
    }

    override setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled)
        if (isDisabled) {
            this.el.setAttribute("disabled", "true")
        } else {
            this.el.removeAttribute("disabled")
        }
    }

}
