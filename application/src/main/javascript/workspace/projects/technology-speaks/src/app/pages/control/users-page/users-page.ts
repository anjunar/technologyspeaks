import {Component, input, ViewEncapsulation} from '@angular/core';
import User from "../../../domain/control/User";
import {AsIcon, Table} from "shared";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'users-page',
    imports: [
        RouterLink,
        AsIcon
    ],
    templateUrl: './users-page.html',
    styleUrl: './users-page.css',
    encapsulation: ViewEncapsulation.None
})
export class UsersPage {

    users = input.required<Table<User>>()

}
