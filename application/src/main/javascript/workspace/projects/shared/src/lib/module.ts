import {AsArrayForm} from "./components/input/as-array-form/as-array-form";
import {AsFormArray} from "./components/input/as-form-array/as-form-array";
import {AsConfiguredArray} from "./directives/input/as-configured/as-configured-array";
import {AsConfiguredArrayForm} from "./directives/input/as-configured/as-configured-array-form";
import {AsConfiguredForm} from "./directives/input/as-configured/as-configured-form";
import {AsConfiguredInput} from "./directives/input/as-configured/as-configured-input";
import {AsConfiguredLazySelect} from "./directives/input/as-configured/as-configured-lazy-select";
import {AsForm} from "./directives/input/as-form/as-form";
import {AsInput} from "./directives/input/as-input/as-input";
import {AsSubmit} from "./directives/input/as-submit/as-submit";

export const propertyForms = [
    AsArrayForm,
    AsFormArray,
    AsForm,
    AsInput,
    AsSubmit
]

export const configuredPropertyForms = [
    ...propertyForms,
    AsConfiguredArray,
    AsConfiguredArrayForm,
    AsConfiguredForm,
    AsConfiguredInput,
    AsConfiguredLazySelect
]