import {Component, contentChild, input, ViewEncapsulation} from '@angular/core';
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

    ngControl = contentChild(NgControl, { read: NgControl })

    errors() : string[] {
        const e = this.ngControl().errors
        if (!e) return [];

        const messages: string[] = [];
        if (e['required']) messages.push('Dieses Feld ist erforderlich.');
        if (e['minlength']) messages.push(`Mindestlänge: ${e['minlength'].requiredLength}`);
        if (e['maxlength']) messages.push(`Maximallänge: ${e['maxlength'].requiredLength}`);
        return messages;
    }
}
