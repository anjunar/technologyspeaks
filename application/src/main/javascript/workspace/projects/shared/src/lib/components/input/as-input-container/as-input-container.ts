import {Component, contentChild, effect, ElementRef, model, signal, ViewEncapsulation,} from '@angular/core';
import {AsControlInput} from '../../../directives/as-control';
import {toObservable} from "@angular/core/rxjs-interop";
import {match} from "../../../pattern-match";
import {
    EmailValidator,
    NotBlankValidator,
    NotNullValidator,
    PastValidator,
    SizeValidator
} from "../../../domain/descriptors";

@Component({
    selector: 'as-input-container',
    templateUrl: './as-input-container.html',
    styleUrl: './as-input-container.css',
    encapsulation: ViewEncapsulation.None,
})
export class AsInputContainer {
    placeholder = model<string>('default');
    control = contentChild(AsControlInput);
    element = contentChild(AsControlInput, {read: ElementRef<HTMLInputElement>});

    focus = signal(false);
    dirty = signal(false);
    isEmpty = signal(true);
    errors = signal<string[]>([]);

    constructor() {

        toObservable(this.control)
            .subscribe((control) => {
                this.placeholder.set(control.placeholder());
                this.isEmpty.set(!control.model());
                this.dirty.set(control.dirty());

                let placeHolderSubscription = control.placeholder.subscribe(value => {
                    this.placeholder.set(value);
                })


                let errorSubscription = control.errors.subscribe(errors => {
                    if (errors && control.dirty()) {
                        let messages : unknown[] = errors.map(error => {
                            return match(error)
                                .withObject(EmailValidator, validator => "not a valid Email")
                                .withObject(NotBlankValidator, validator => "not a Blank")
                                .withObject(NotNullValidator, validator => "not Null")
                                .withObject(PastValidator, validator => "not in the past")
                                .withObject(SizeValidator, validator => `Size between ${validator.min} and ${validator.max}`)
                                .nonExhaustive()
                        })
                        this.errors.set(messages as string[]);
                    } else {
                        this.errors.set([]);
                    }
                })

                let controlSubscription = control.model.subscribe(value => {
                    this.isEmpty.set(!value);
                    this.dirty.set(control.dirty());
                })

                return () => {
                    placeHolderSubscription.unsubscribe()
                    errorSubscription.unsubscribe()
                    controlSubscription.unsubscribe()
                }
            })

        effect(() => {
            const elRef = this.element();
            const input: HTMLInputElement = elRef.nativeElement;
            input.placeholder = this.placeholder();

            const onFocus = () => this.focus.set(true);
            const onBlur = () => this.focus.set(false);

            input.addEventListener('focus', onFocus);
            input.addEventListener('blur', onBlur);

            return () => {
                input.removeEventListener('focus', onFocus);
                input.removeEventListener('blur', onBlur);
            };
        });


    }
}
