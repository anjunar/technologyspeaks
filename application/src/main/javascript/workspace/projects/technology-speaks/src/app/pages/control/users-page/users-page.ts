import {Component, input} from '@angular/core';
import User from "../../../domain/control/User";
import {Table} from "shared";

@Component({
  selector: 'users-page',
  imports: [],
  templateUrl: './users-page.html',
  styleUrl: './users-page.css'
})
export class UsersPage {

    users = input.required<Table<User>>()

}
