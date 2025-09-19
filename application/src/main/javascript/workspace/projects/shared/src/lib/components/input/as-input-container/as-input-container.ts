import {Component, contentChild, effect, ElementRef, input, signal, ViewEncapsulation} from '@angular/core';
import {NgControl} from "@angular/forms";
import {AsControlInput} from "../../../directives/as-control";

@Component({
    selector: 'as-input-container',
    templateUrl: './as-input-container.html',
    styleUrl: './as-input-container.css',
    encapsulation: ViewEncapsulation.None
})
export class AsInputContainer {

    placeholder = signal<string>("")

    control = contentChild(NgControl)

    element = contentChild(NgControl, {read: ElementRef<HTMLInputElement>})

    focus = signal(false)

    dirty = signal(false)

    isEmpty = signal(true)

    errors = signal([])

    constructor() {
        effect(() => {
            let asControl = this.control();
            let valueSub= asControl.control.valueChanges.subscribe((value) => {
                this.isEmpty.set(!value);
                this.dirty.set(asControl.dirty);

                const e = this.control().errors
                if (e && asControl.dirty) {
                    const messages: string[] = []
                    if (e['required']) messages.push('A value is required')
                    if (e['minlength']) messages.push(`Minimum length: ${e['minlength'].requiredLength}`)
                    if (e['maxlength']) messages.push(`Maximum length: ${e['maxlength'].requiredLength}`)
                    if (e['email']) messages.push(`no valid Email`)
                    if (e['server']) messages.push(e['server'].message)
                    this.errors.set(messages)
                } else {
                    this.errors.set([])
                }
            });

            let statusSub = asControl.control.statusChanges.subscribe((value) => {
                const e = this.control().errors
                if (e) {
                    const messages: string[] = []
                    if (e['server']) messages.push(e['server'].message)
                    this.errors.set(Object.assign(messages, this.errors()))
                } else {
                    this.errors.set([])
                }
            });

            this.placeholder.set((asControl as AsControlInput).placeholder)
            this.isEmpty.set(!asControl.value);
            this.dirty.set(asControl.dirty);

            return () => {
                valueSub.unsubscribe()
                statusSub.unsubscribe()
            }
        })

        effect(() => {
            const element: HTMLInputElement = this.element().nativeElement

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
    }

}
