import {Component, ElementRef, inject, input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'as-icon',
  imports: [],
  templateUrl: './as-icon.html',
  styleUrl: './as-icon.css',
  encapsulation : ViewEncapsulation.None
})
export class AsIcon {

    value = input.required()

    el = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>).nativeElement

    constructor() {
        this.el.className = "material-icons"
    }

}
