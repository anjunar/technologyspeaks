import {
    AfterContentChecked, AfterContentInit,
    Component,
    computed,
    contentChild, effect,
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
export class AsInputContainer {

    placeholder = input.required<string>()

    ngControl = contentChild(NgControl)

    element = contentChild(NgControl, {read : ElementRef<HTMLInputElement>})

    focus = signal(false)

    dirty = signal(false)

    isEmpty = signal(true)

    errors = signal([])

    constructor() {
        effect(() => {
            let ngControl = this.ngControl();
            const sub = ngControl.valueChanges.subscribe(value => {
                this.isEmpty.set(!value);
                this.dirty.set(ngControl.dirty);

                const e = this.ngControl().errors
                if (e && ngControl.dirty) {
                    const messages: string[] = []
                    if (e['required']) messages.push('A value is required')
                    if (e['minlength']) messages.push(`Minimum length: ${e['minlength'].requiredLength}`)
                    if (e['maxlength']) messages.push(`Maximum length: ${e['maxlength'].requiredLength}`)
                    if (e['email']) messages.push(`no valid Email`)
                    this.errors.set(messages)
                } else {
                    this.errors.set([])
                }
            });


            return () => sub.unsubscribe();
        })

        effect(() => {
            const element : HTMLInputElement = this.element().nativeElement

            element.placeholder = this.placeholder()

            let focusListener = () => this.focus.set(true);
            element.addEventListener('focus', focusListener)
            let blurListener = () => this.focus.set(false);
            element.addEventListener('blur', blurListener);

            return () => {
                element.removeEventListener('focus', focusListener)
                element.removeEventListener('blur', blurListener)
            }
        });

        effect(() => {
            const element: HTMLInputElement = this.element().nativeElement;
            element.classList.toggle('focus', this.focus());
            element.classList.toggle('dirty', this.dirty() && this.focus());
        });
    }

}
