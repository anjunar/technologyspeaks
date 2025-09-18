import {Component, computed, ElementRef, inject, input, ViewEncapsulation} from '@angular/core';
import {WindowConfig, WindowManagerService} from "./service/window-manager-service";
import {NgComponentOutlet} from "@angular/common";

@Component({
    selector: 'as-window',
    imports: [
        NgComponentOutlet
    ],
    templateUrl: './as-window.html',
    styleUrl: './as-window.css',
    encapsulation: ViewEncapsulation.None
})
export class AsWindow {

    element = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>).nativeElement

    window = input.required<WindowConfig>();

    resizable = computed(() => this.window()?.resizeable || true)
    maximized = computed(() => this.window()?.maximizable || false)
    draggable = computed(() => this.window()?.draggable || true)
    centered = computed(() => this.window()?.centered || true)

    manager = inject(WindowManagerService);

    constructor() {
        setTimeout(() => this.centerWindow(), 0);
    }

    private centerWindow() {
        const parent = this.element.parentElement;
        if (!parent) return;

        const parentRect = parent.getBoundingClientRect();
        const windowRect = this.element.getBoundingClientRect();

        this.element.style.position = 'absolute';
        this.element.style.left = `${((parentRect.width / 2) - (windowRect.width / 2))}px`;
        this.element.style.top = `${((parentRect.height / 2) - (windowRect.height / 2))}px`;
    }

    close() {
        this.manager.close(this.window().id);
    }

    dragElementMouseDown = (event: MouseEvent) => {
        let element = this.element
        let deltaX = 0,
            deltaY = 0,
            pointerX = 0,
            pointerY = 0

        let elementDrag = (e: MouseEvent) => {
            e.preventDefault()
            deltaX = pointerX - e.clientX
            deltaY = pointerY - e.clientY
            pointerX = e.clientX
            pointerY = e.clientY
            let top = element.offsetTop - deltaY
            if (top < 0) {
                top = 0
            }
            let left = element.offsetLeft - deltaX
            element.style.top = top + "px"
            element.style.left = left + "px"
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (!this.maximized() && this.draggable) {
            event.preventDefault()
            pointerX = event.clientX
            pointerY = event.clientY
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    nResizeMouseDown = (event: MouseEvent) => {
        let element = this.element
        let delta = element.offsetTop,
            pointer = element.offsetTop

        let elementDrag = (event: MouseEvent) => {
            event.preventDefault()
            delta = pointer - event.clientY
            pointer = event.clientY
            element.style.height = element.offsetHeight - 2 + delta + "px"
            element.style.top = element.offsetTop - delta + "px"
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (this.resizable() && !this.maximized()) {
            event.preventDefault()
            pointer = event.clientY
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    nwResizeMouseDown = (event: MouseEvent) => {
        let element = this.element
        let deltaY = element.offsetTop,
            pointerY = element.offsetTop
        let deltaX = element.offsetLeft,
            pointerX = element.offsetLeft

        let elementDrag = (event: MouseEvent) => {
            event.preventDefault()
            deltaY = pointerY - event.clientY
            pointerY = event.clientY
            element.style.height = element.offsetHeight - 2 + deltaY + "px"
            element.style.top = element.offsetTop - deltaY + "px"

            deltaX = pointerX - event.clientX
            pointerX = event.clientX
            element.style.width = element.offsetWidth - 2 + deltaX + "px"
            element.style.left = element.offsetLeft - deltaX + "px"
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (this.resizable() && !this.maximized()) {
            event.preventDefault()
            pointerY = event.clientY
            pointerX = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    wResizeMouseDown = (event: MouseEvent) => {
        let element = this.element
        let delta = element.offsetLeft,
            pointer = element.offsetLeft

        let elementDrag = (event: MouseEvent) => {
            event.preventDefault()
            delta = pointer - event.clientX
            pointer = event.clientX
            element.style.width = element.offsetWidth - 2 + delta + "px"
            element.style.left = element.offsetLeft - delta + "px"
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (this.resizable() && !this.maximized()) {
            event.preventDefault()
            pointer = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    swResizeMouseDown = (event: MouseEvent) => {
        let element = this.element
        let deltaY = element.offsetTop,
            pointerY = element.offsetTop
        let deltaX = element.offsetLeft,
            pointerX = element.offsetLeft

        let elementDrag = (event: MouseEvent) => {
            event.preventDefault()
            deltaY = pointerY - event.clientY
            pointerY = event.clientY
            element.style.height = element.offsetHeight - 2 - deltaY + "px"
            element.style.bottom =
                element.offsetTop + (element.offsetHeight - 2) - deltaY + "px"

            deltaX = pointerX - event.clientX
            pointerX = event.clientX
            element.style.width = element.offsetWidth - 2 + deltaX + "px"
            element.style.left = element.offsetLeft - deltaX + "px"
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (this.resizable() && !this.maximized()) {
            event.preventDefault()
            pointerY = event.clientY
            pointerX = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    neResizeMouseDown = (event: MouseEvent) => {
        let element = this.element
        let deltaY = element.offsetTop,
            pointerY = element.offsetTop
        let deltaX = element.offsetLeft,
            pointerX = element.offsetLeft

        let elementDrag = (event: MouseEvent) => {
            event.preventDefault()
            deltaY = pointerY - event.clientY
            pointerY = event.clientY
            element.style.height = element.offsetHeight - 2 + deltaY + "px"
            element.style.top = element.offsetTop - deltaY + "px"

            deltaX = pointerX - event.clientX
            pointerX = event.clientX
            element.style.width = element.offsetWidth - 2 - deltaX + "px"
            element.style.right =
                element.offsetLeft + (element.offsetWidth - 2) - deltaX + "px"
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (this.resizable() && !this.maximized()) {
            event.preventDefault()
            pointerY = event.clientY
            pointerX = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    eResizeMouseDown = (event: MouseEvent) => {
        let element = this.element
        let delta = element.offsetLeft,
            pointer = element.offsetLeft

        let elementDrag = (event: MouseEvent) => {
            event.preventDefault()
            delta = pointer - event.clientX
            pointer = event.clientX
            element.style.width = element.offsetWidth - 2 - delta + "px"
            element.style.right =
                element.offsetLeft + (element.offsetWidth - 2) - delta + "px"
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (this.resizable() && !this.maximized()) {
            event.preventDefault()
            pointer = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    seResizeMouseDown = (event: MouseEvent) => {
        let element = this.element
        let deltaY = element.offsetTop,
            pointerY = element.offsetTop
        let deltaX = element.offsetLeft,
            pointerX = element.offsetLeft

        let elementDrag = (event: MouseEvent) => {
            event.preventDefault()
            deltaY = pointerY - event.clientY
            pointerY = event.clientY
            element.style.height = element.offsetHeight - 2 - deltaY + "px"
            element.style.bottom =
                element.offsetTop + element.offsetHeight - deltaY + "px"

            deltaX = pointerX - event.clientX
            pointerX = event.clientX
            element.style.width = element.offsetWidth - 2 - deltaX + "px"
            element.style.right =
                element.offsetLeft + (element.offsetWidth - 2) - deltaX + "px"
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (this.resizable() && !this.maximized()) {
            event.preventDefault()
            pointerY = event.clientY
            pointerX = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    sResizeMouseDown = (event: MouseEvent) => {
        let element = this.element
        let delta = element.offsetTop,
            pointer = element.offsetTop

        let elementDrag = (event: MouseEvent) => {
            event.preventDefault()
            delta = pointer - event.clientY
            pointer = event.clientY
            element.style.height = element.offsetHeight - 2 - delta + "px"
            element.style.bottom =
                element.offsetTop + (element.offsetHeight - 2) - delta + "px"
        }

        let closeDragElement = () => {
            document.removeEventListener("mouseup", closeDragElement)
            document.removeEventListener("mousemove", elementDrag)
        }

        if (this.resizable() && !this.maximized()) {
            event.preventDefault()
            pointer = event.clientY
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

}
