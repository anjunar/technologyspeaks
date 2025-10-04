import {Component, ViewEncapsulation, model, effect} from '@angular/core';
import {AsEditor, AsForm} from "shared";

@Component({
  selector: 'home-page',
  imports: [AsForm, AsEditor],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  encapsulation : ViewEncapsulation.None
})
export class HomePage {

    model = model()


    constructor() {
        effect(() => {
            console.log(this.model())
        });
    }
}
