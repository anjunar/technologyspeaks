import { Directive } from '@angular/core';
import {AsControl} from "../../as-control";

@Directive()
export abstract class AsAbstractConfigured {

    abstract parent : AsAbstractConfigured;

    abstract control : AsControl<any>

}
