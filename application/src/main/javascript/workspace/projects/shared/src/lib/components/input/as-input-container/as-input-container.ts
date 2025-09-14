import {
    Component,
    computed,
    contentChild,
    ElementRef, inject,
    input, OnInit, Renderer2,
    signal,
    ViewEncapsulation
} from '@angular/core';
import {NgControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'as-input-container',
  imports: [ReactiveFormsModule],
  templateUrl: './as-input-container.html',
  styleUrl: './as-input-container.css',
  encapsulation : ViewEncapsulation.None
})
export class AsInputContainer implements OnInit {

    placeholder = input.required<string>()

    ngControl = contentChild(NgControl)

    focus = signal(false)

    dirty = signal(false)

    isEmpty = signal(true)

    errors = computed(() => {
        const e = this.ngControl().errors
        if (!e) return []

        const messages: string[] = []
        if (e['required']) messages.push('Dieses Feld ist erforderlich.')
        if (e['minlength']) messages.push(`Mindestlänge: ${e['minlength'].requiredLength}`)
        if (e['maxlength']) messages.push(`Maximallänge: ${e['maxlength'].requiredLength}`)
        return messages;
    })

    renderer = inject(Renderer2)

    ngOnInit() {
        let element : HTMLInputElement = this.renderer.selectRootElement("input")

        element.placeholder = this.placeholder()

        element.addEventListener('focus', () => this.focus.set(true))
        element.addEventListener('blur', () => this.focus.set(false))

        this.ngControl().valueChanges.subscribe((value) => {
            this.isEmpty.set(value)
            this.dirty.set(this.ngControl().dirty)
        })
    }
}
