import {Component, input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'as-drawer-container',
  imports: [],
  templateUrl: './as-drawer-container.html',
  styleUrl: './as-drawer-container.css',
  encapsulation : ViewEncapsulation.None
})
export class AsDrawerContainer {

    open = input(true)

}
