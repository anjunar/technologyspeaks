import {Component, input, signal, ViewEncapsulation} from '@angular/core';
import {TableCommands} from "../table-commands";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'editor-table-window',
    imports: [
        FormsModule
    ],
    templateUrl: './table-window.html',
    styleUrl: './table-window.css',
    encapsulation: ViewEncapsulation.None
})
export class TableWindow {

    parent = input.required<TableCommands>()

    rows = signal(2)

    columns = signal(2)

    close() {
        this.parent().insertTable(this.rows(), this.columns())
        this.parent().service.close("openTable")
    }
}
