import {NgModule} from '@angular/core';
import {AsConfiguredForm} from "../directives/input/as-configured/as-configured-form";
import {AsConfiguredArray} from "../directives/input/as-configured/as-configured-array";
import {AsConfiguredArrayForm} from "../directives/input/as-configured/as-configured-array-form";
import {AsConfiguredInput} from "../directives/input/as-configured/as-configured-input";


@NgModule({
    declarations: [
        AsConfiguredArray,
        AsConfiguredArrayForm,
        AsConfiguredForm,
        AsConfiguredInput,
    ],
    exports: [
        AsConfiguredArray,
        AsConfiguredArrayForm,
        AsConfiguredForm,
        AsConfiguredInput
    ]
})
export class PropertyFormsModule {
}
