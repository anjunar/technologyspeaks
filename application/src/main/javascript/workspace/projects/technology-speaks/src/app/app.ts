import {Component, signal, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AsToolbar} from 'shared';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsToolbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation : ViewEncapsulation.None
})
export class App {
  protected readonly title = signal('technology-speaks');
}
