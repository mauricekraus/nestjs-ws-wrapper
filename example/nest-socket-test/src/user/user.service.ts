import { Injectable } from '@nestjs/common';

export interface User {
  name: string;
  id: string;
}

@Injectable()
export class UserService {
  private users: User[];
  constructor() {
    this.users = [];
  }

  findById(id: string): User {
    const res = this.users.filter(us => us.id === id);
    if (res.length !== 0) {
      return res[0];
    } else {
      throw new Error('Not Found');
    }
  }

  addUser(user: User) {
    this.users.push(user);
  }
}
