import {Component, computed, effect, inject, input, OnDestroy, OnInit, signal, ViewEncapsulation} from '@angular/core';
import {AbstractControl, NG_VALUE_ACCESSOR, NgControl, ValidationErrors} from "@angular/forms";
import {AsControlInput, AsControlValueAccessor} from "../../../directives/as-control";
import {AsForm} from "../../../directives/input/as-form/as-form";
import Media from "../../../domain/types/Media";
import {AsImageProcess} from "./as-image-process/as-image-process";
import {CropperPosition} from "ngx-image-cropper";
import {WindowManagerService} from "../../modal/as-window/service/window-manager-service";

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
export class AsImage extends AsControlInput implements AsControlValueAccessor {

    windowService = inject(WindowManagerService)

    cropper = signal<CropperPosition>({x1: 0, x2: 0, y1: 100, y2: 100})

    image = signal<Media>(null)

    text = signal("Please click here...")


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

    constructor() {
        super();

        effect(() => {
            this.onChange.forEach(fn => fn(this.inputName(), this.image()));
        });
    }

    controlAdded(): void {
        this.placeholder = this.descriptor.title
    }

    get placeholder() {
        return this.text()
    }

    set placeholder(value: string) {
        this.text.set(value)
    }

    openWindow() {
        if (! this.disabledImage()) {
            this.windowService.open({
                id: "image-processor",
                title: "Image Processor",
                component: AsImageProcess,
                inputs: {
                    parent: this
                }
            })
        }
    }

    encodeBase64 = (type: string, data: string) => {
        if (data) {
            return `data:${type};base64,${data}`
        }
        return ""
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
        return this.image()?.data === this.default()?.data
    }

    override get dirty(): boolean {
        return !this.pristine
    }

    override get errors(): ValidationErrors {
        return {}
    }

    override get path(): string[] | null {
        return this.inputName() ? [this.inputName()] : null;
    }

    override valueAccessor: AsControlValueAccessor = this

}
