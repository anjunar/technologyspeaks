import { Pipe, PipeTransform } from '@angular/core';
import User from "../../../domain/control/User";

@Pipe({
  name: 'userType'
})
export class UserPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): User {
    return value as User
  }

}
