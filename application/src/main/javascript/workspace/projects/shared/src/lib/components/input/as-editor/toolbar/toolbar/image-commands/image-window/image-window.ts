import {Component, computed, effect, ElementRef, input, signal, viewChild, ViewEncapsulation} from '@angular/core';
import {ImageCommands} from "../image-commands";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'editor-image-window',
    imports: [
        FormsModule
    ],
    templateUrl: './image-window.html',
    styleUrl: './image-window.css',
    encapsulation: ViewEncapsulation.None
})
export class ImageWindow {

    parent = input.required<ImageCommands>()
    attrs = input.required<{ src: string, width: number, height: number }>()

    file = viewChild<ElementRef<HTMLInputElement>>("file")
    image = viewChild<ElementRef<HTMLImageElement>>("image")

    src = signal<string>(null)
    width = signal<number>(300)
    height = signal<number>(300)

    private lastChanged: 'width' | 'height' = 'width'

    aspectRatio = computed(() => {
        if (this.image() && this.src()) {
            const img = this.image().nativeElement
            return img.naturalWidth / img.naturalHeight
        }
        return 1
    })

    constructor() {
        effect(() => {
            const attrs = this.attrs()
            if (attrs.src) this.src.set(attrs.src)
            if (attrs.width) this.width.set(attrs.width)
            if (attrs.height) this.height.set(attrs.height)
        })

        effect(() => {
            const ratio = this.aspectRatio()
            if (!ratio || ratio <= 0) return

            if (this.lastChanged === 'width') {
                this.height.set(Math.max(16, Math.round(this.width() / ratio)))
            } else if (this.lastChanged === 'height') {
                this.width.set(Math.max(16, Math.round(this.height() * ratio)))
            }
        })
    }

    onWidthChange(value: number) {
        this.lastChanged = 'width'
        this.width.set(value)
    }

    onHeightChange(value: number) {
        this.lastChanged = 'height'
        this.height.set(value)
    }

    openImage() {
        this.file().nativeElement.click()
    }

    fileChangeEvent(event: Event): void {
        const input = event.target as HTMLInputElement
        if (!input.files || input.files.length === 0) return

        const file = input.files[0]
        const reader = new FileReader()

        reader.onload = () => {
            this.src.set(reader.result as string)

            const img = new Image()
            img.onload = () => {
                this.lastChanged = 'width'
                this.width.set(img.naturalWidth)
                this.height.set(img.naturalHeight)
            }
            img.src = reader.result as string

            input.value = ""
        }

        reader.readAsDataURL(file)
    }

}
