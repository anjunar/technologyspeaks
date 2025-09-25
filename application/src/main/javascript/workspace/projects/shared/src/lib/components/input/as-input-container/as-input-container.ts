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
import {ServerValidator} from "../../../domain/descriptors/validators/Validator";

@Component({
    selector: 'as-input-container',
    templateUrl: './as-input-container.html',
    styleUrl: './as-input-container.css',
    encapsulation: ViewEncapsulation.None,
})
export class AsInputContainer {
    placeholder = model<string>('');
    control = contentChild(AsControlInput);
    element = contentChild(AsControlInput, {read: ElementRef<HTMLInputElement>});

    focus = signal(false);
    dirty = signal(false);
    isEmpty = signal(false);
    errors = signal<string[]>([]);

    constructor() {

        toObservable(this.control)
            .subscribe((control) => {
                let model = ! control.model();
                let dirty = control.dirty();
                let placeholder = control.placeholder();

                this.isEmpty.set(model);
                this.dirty.set(dirty);
                this.placeholder.set(placeholder);

                let errorSubscription = control.errors.subscribe(errors => {
                    if (errors && control.dirty()) {
                        let messages : unknown[] = errors.map(error => {
                            return match(error)
                                .withObject(EmailValidator, validator => "not a valid Email")
                                .withObject(NotBlankValidator, validator => "not a Blank")
                                .withObject(NotNullValidator, validator => "not Null")
                                .withObject(PastValidator, validator => "not in the past")
                                .withObject(SizeValidator, validator => `Size between ${validator.min} and ${validator.max}`)
                                .withObject(ServerValidator, validator => validator.message)
                                .nonExhaustive()
                        })
                        this.errors.set(messages as string[]);
                    } else {
                        this.errors.set([]);
                    }
                })

                let dirtySubscription = control.dirty.subscribe(value => {
                    this.dirty.set(value);
                })

                let controlSubscription = control.model.subscribe(value => {
                    this.isEmpty.set(!value);
                    this.placeholder.set(control.placeholder());
                })

                return () => {
                    dirtySubscription.unsubscribe()
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
