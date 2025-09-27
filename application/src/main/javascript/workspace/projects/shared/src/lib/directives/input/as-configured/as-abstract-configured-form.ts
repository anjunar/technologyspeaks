import {Directive} from '@angular/core';
import {ObjectDescriptor} from "../../../domain/descriptors";
import {PropertiesContainer} from "../../../domain/container/ActiveObject";
import {AsAbstractConfigured} from "./as-abstract-configured";
import {AsControlForm} from "../../as-control";

@Directive()
export abstract class AsAbstractConfiguredForm extends AsAbstractConfigured {

    override control : AsControlForm<any>

    descriptor: ObjectDescriptor;
    instance: PropertiesContainer;

}