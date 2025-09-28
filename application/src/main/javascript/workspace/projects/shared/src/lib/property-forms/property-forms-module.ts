import {NgModule} from '@angular/core';
import {AsConfiguredForm} from "../directives/input/as-configured/as-configured-form";
import {AsConfiguredArray} from "../directives/input/as-configured/as-configured-array";
import {AsConfiguredArrayForm} from "../directives/input/as-configured/as-configured-array-form";
import {AsConfiguredInput} from "../directives/input/as-configured/as-configured-input";
import {AsConfiguredLazySelect} from "../directives/input/as-configured/as-configured-lazy-select";


@NgModule({
    declarations: [
        AsConfiguredArray,
        AsConfiguredArrayForm,
        AsConfiguredForm,
        AsConfiguredInput,
        AsConfiguredLazySelect
    ],
    exports: [
        AsConfiguredArray,
        AsConfiguredArrayForm,
        AsConfiguredForm,
        AsConfiguredInput,
        AsConfiguredLazySelect
    ]
})
export class PropertyFormsModule {
}
