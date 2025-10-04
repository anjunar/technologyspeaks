import {Component, inject, signal, ViewEncapsulation} from '@angular/core';
import {EditorView} from "prosemirror-view";
import {findTable, goToNextCell, tableEditing, tableNodes} from "prosemirror-tables";
import {Fragment, NodeSpec, Schema} from "prosemirror-model";
import {AsIcon} from "../../../../../layout/as-icon/as-icon";
import {Command, Plugin, TextSelection} from "prosemirror-state";
import {EditorCommandComponent} from "../EditorCommandComponent";
import {keymap} from "prosemirror-keymap";
import {chainCommands} from "prosemirror-commands";
import {WindowManagerService} from "../../../../../modal/as-window/service/window-manager-service";
import {TableWindow} from "./table-window/table-window";

@Component({
    selector: 'editor-table-commands',
    imports: [
        AsIcon
    ],
    templateUrl: './table-commands.html',
    styleUrl: './table-commands.css',
    encapsulation: ViewEncapsulation.None
})
export class TableCommands extends EditorCommandComponent {

    editor = signal<{ view: EditorView }>({view: null});

    service = inject(WindowManagerService)

    open() {
        this.service.open({
            id: "openTable",
            title: "Add Table",
            component: TableWindow,
            inputs: {
                parent: this
            }
        })
    }

    plugins(schema: Schema): Plugin[] {
        return [
            keymap({
                "Mod-Enter": (state, dispatch, view) => {
                    if (view) {
                        this.insertAboveTable(view);
                        return true;
                    }
                    return false;
                },
                "Tab": chainCommands(
                    goToNextCell(1),
                    this.exitTableCommand
                ),
                "Shift-Tab": goToNextCell(-1),
                "Mod-Backspace": this.deleteTableCommand,
            }),
            tableEditing()
        ]
    }

    get nodeSpec(): NodeSpec {
        return tableNodes({
            tableGroup: "block",
            cellContent: "block+",
            cellAttributes: {}
        }) as any;
    }

    deleteTableCommand: Command = (state, dispatch) => {
        const { schema } = state;
        const { paragraph } = schema.nodes;

        if (!paragraph) return false;

        const tableResult = findTable(state.selection.$from);
        if (!tableResult) return false;

        const tablePos = tableResult.pos;
        const tableEnd = tablePos + tableResult.node.nodeSize;

        let tr = state.tr.delete(tablePos, tableEnd);

        const paragraphNode = paragraph.create();
        tr = tr.insert(tablePos, paragraphNode);

        const paragraphPos = tablePos + 1;
        tr = tr.setSelection(TextSelection.create(tr.doc, paragraphPos));

        if (dispatch) {
            dispatch(tr.scrollIntoView());
        }
        return true;
    };

    insertAboveTable(view: EditorView) {
        const { state, dispatch } = view;
        const { schema } = state;
        const { paragraph, table } = schema.nodes;

        if (!paragraph || !table) return;

        const tableResult = findTable(state.selection.$from);
        if (!tableResult) return;

        const tablePos = tableResult.pos;
        if (tablePos !== 0) {
            return;
        }

        const paragraphNode = paragraph.create();

        let tr = state.tr.insert(tablePos, paragraphNode);

        const newParagraphPos = tablePos + 1;
        tr = tr.setSelection(TextSelection.create(tr.doc, newParagraphPos));

        dispatch(tr.scrollIntoView());
        view.focus();
    }

    exitTableCommand: Command = (state, dispatch) => {
        const { schema } = state;
        const { paragraph } = schema.nodes;

        if (!paragraph) return false;

        const tableResult = findTable(state.selection.$from);
        if (!tableResult) return false;

        const afterTablePos = tableResult.pos + tableResult.node.nodeSize;
        const paragraphNode = paragraph.create();

        let tr = state.tr.insert(afterTablePos, paragraphNode);
        const paragraphPos = afterTablePos + 1;
        tr = tr.setSelection(TextSelection.create(tr.doc, paragraphPos));

        if (dispatch) {
            dispatch(tr.scrollIntoView());
        }
        return true;
    };

    insertTable(rows = 3, cols = 3) {
        const view = this.editor()?.view;
        if (!view) return;

        const { state, dispatch } = view;
        const { schema } = state;
        const { table, table_row, table_cell, paragraph } = schema.nodes;

        if (!table || !paragraph) return;

        const cells = [];
        for (let i = 0; i < cols; i++) {
            cells.push(table_cell.createAndFill());
        }

        const rowsArr = [];
        for (let r = 0; r < rows; r++) {
            rowsArr.push(table_row.create(null, Fragment.from(cells)));
        }

        const tableNode = table.create(null, rowsArr);
        const paragraphNode = paragraph.create();

        let tr = state.tr;

        tr = tr.replaceSelectionWith(tableNode);

        const afterTablePos = tr.selection.$to.after();

        tr = tr.insert(afterTablePos, paragraphNode);

        const paragraphPos = afterTablePos + 1;
        tr = tr.setSelection(TextSelection.create(tr.doc, paragraphPos));

        dispatch(tr);
        view.focus();
    }

}
