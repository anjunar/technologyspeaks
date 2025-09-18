import {
    Component,
    computed,
    ElementRef,
    inject,
    input, model,
    OnDestroy,
    OnInit,
    signal,
    ViewEncapsulation
} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgControl, ValidationErrors} from "@angular/forms";
import {AsControl} from "../../../directives/as-control";
import {AsForm} from "../../../directives/input/as-form/as-form";
import Media from "../../../domain/types/Media";
import {Thumbnail, WindowManagerService} from "shared";
import {AsImageProcess} from "./as-image-process/as-image-process";

@Component({
    selector: 'as-image',
    imports: [],
    templateUrl: './as-image.html',
    styleUrl: './as-image.css',
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AsImage,
            multi: true
        },
        {
            provide: NgControl,
            useExisting: AsImage,
            multi: true
        }
    ]
})
export class AsImage extends AsControl implements OnInit, OnDestroy {

    onChange: ((name : string, value: any) => void)[] = []
    onTouched: (() => void)[] = []

    form = inject(AsForm)

    windowService = inject(WindowManagerService)

    inputName = input<string>("", {alias: "name"})

    image = signal<Media>(null)

    thumbnailUrl = computed(() => {
        let media = this.image();
        if (media) {
            return this.encodeBase64(media.thumbnail().contentType(), this.image().thumbnail().data())
        }
        return null
    })

    mediaUrl = computed(() => {
        let image = this.image();
        if (image) {
            return this.encodeBase64(image.contentType(), this.image().data())
        }
        return null
    })

    default = signal<Media>(null)

    disabledImage = signal(false)

    openWindow() {
        this.windowService.open({
            id : "image-processor",
            title : "Image Processor",
            component : AsImageProcess,
            inputs : {
                parent : this
            }
        })
    }

    encodeBase64 = (type: string, data: string) => {
        if (data) {
            return `data:${type};base64,${data}`
        }
        return ""
    }

    ngOnInit(): void {
        this.form.addControl(this.inputName(), this)
    }

    ngOnDestroy(): void {
        this.form.removeControl(this.inputName(), this)
    }

    set type(value: string) {}

    registerOnChange(fn: any): void {
        this.onChange.push(fn)
    }

    unRegisterOnChange(fn: any): void {
        let indexOf = this.onChange.indexOf(fn);
        this.onChange.splice(indexOf, 1)
    }

    registerOnTouched(fn: any): void {
        this.onTouched.push(fn)
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabledImage.set(isDisabled)
    }

    override get value(): any {
        return this.image()
    }

    writeValue(obj: any): void {
        if (obj) {
            this.image.set(obj)
        } else {
            this.image.set(null)
        }
    }

    writeDefaultValue(obj: any): void {
        if (obj) {
            this.default.set(obj)
        } else {
            this.default.set(null)
        }
    }

    override get pristine(): boolean {
        return this.image().data === this.default().data
    }

    override get dirty(): boolean {
        return !this.pristine
    }

    override get errors(): ValidationErrors {
        return {}
    }

    viewToModelUpdate(newValue: any): void {
        this.writeValue(newValue)
    }

    override get path(): string[] | null {
        return this.inputName() ? [this.inputName()] : null;
    }

}
