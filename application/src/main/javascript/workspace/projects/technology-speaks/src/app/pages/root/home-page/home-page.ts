import {Component, ViewEncapsulation} from '@angular/core';
import {AsEditor} from "shared";

@Component({
  selector: 'home-page',
  imports: [AsEditor],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  encapsulation : ViewEncapsulation.None
})
export class HomePage {

}
