import {Directive, inject, OnInit} from '@angular/core';
import {AsAbstractConfiguredForm} from "./as-abstract-configured-form";
import {AsControlInput} from "../../as-control";
import {
    EmailValidator,
    NotBlankValidator,
    NotNullValidator,
    PastValidator,
    PatternValidator, SizeValidator
} from "../../../domain/descriptors";
import {PropertiesContainer} from "../../../domain/container/ActiveObject";
import PropertyDescriptor from "../../../domain/descriptors/PropertyDescriptor";
import {AsInput} from "../as-input/as-input";
import {AsAbstractConfigured} from "./as-abstract-configured";
import UIField from "../../../mapper/annotations/UIField";
import {match} from "../../../pattern-match";
import Email from "../../../mapper/annotations/validators/Email";
import Validator from "../../../domain/descriptors/validators/Validator";
import NotBlank from "../../../mapper/annotations/validators/NotBlank";
import NotNull from "../../../mapper/annotations/validators/NotNull";
import Past from "../../../mapper/annotations/validators/Past";
import Pattern from "../../../mapper/annotations/validators/Pattern";
import Size from "../../../mapper/annotations/validators/Size";

@Directive({
    selector: 'input[property], as-image[property]'
})
export class AsConfiguredInput extends AsAbstractConfigured implements OnInit {

    override control = inject(AsControlInput, {self: true});

    override parent = inject(AsAbstractConfiguredForm, {skipSelf: true});

    instance: PropertyDescriptor;

    ngOnInit(): void {
        const name = this.control.name();

        let property: { annotations: Map<Function, any> } = this.parent.properties[name]

        if (this.parent.descriptors) {
            this.instance = (this.parent.descriptors as PropertiesContainer)[name];
        }

        let schema = property.annotations.get(UIField);

        this.control.placeholder.set(schema?.title || name);

        if (this.control instanceof AsInput) {
            this.control.type.set(schema?.widget || "text");


            if (this.control.type() === "checkbox") {
                this.control.isEmpty.set(false)
            } else {
                this.control.isEmpty.set(!this.control.model())
            }
        }

        property.annotations.forEach((annotation, key) => {
            let validator = match<Function, Validator<any>>(key)
                .withFunction(Email, email => new EmailValidator())
                .withFunction(NotBlank, notBlank => new NotBlankValidator())
                .withFunction(NotNull, notNull => new NotNullValidator())
                .withFunction(Past, past => new PastValidator())
                .withFunction(Pattern, pattern => new PatternValidator(annotation.regex))
                .withFunction(Size, size => new SizeValidator(annotation.min, annotation.max))
                .nonExhaustive();

            if (validator) {
                this.control.addValidator(validator)
            }
        })

    }

}
