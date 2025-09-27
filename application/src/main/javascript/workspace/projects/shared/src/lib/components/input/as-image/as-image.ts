import {Component, computed, effect, ElementRef, inject, ModelSignal, signal, model, ViewEncapsulation} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {AsControlInput, AsControlValueAccessor} from "../../../directives/as-control";
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
            provide: AsControlInput,
            useExisting: AsImage,
        }
    ]
})
export class AsImage extends AsControlInput<Media> implements AsControlValueAccessor {

    override model = model<Media>()

    override default = model<Media>()

    windowService = inject(WindowManagerService)

    cropper = signal<CropperPosition>({x1: 0, x2: 0, y1: 100, y2: 100})

    text = signal("Please click here...")

    el = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>).nativeElement

    thumbnailUrl = computed(() => {
        let media = this.model();
        if (media) {
            return this.encodeBase64(media.thumbnail().contentType(), this.model().thumbnail().data())
        }
        return null
    })

    mediaUrl = computed(() => {
        let image = this.model();
        if (image) {
            return this.encodeBase64(image.contentType(), this.model().data())
        }
        return null
    })

    disabled = signal(false)

    constructor() {
        super();

        effect(() => {
            this.onChange.forEach(fn => fn(this.name(), this.model(), this.default(), this.el));
        });
    }

    controlAdded(): void {
    }

    openWindow() {
        if (!this.disabled()) {
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
        this.disabled.set(isDisabled)
    }

}
