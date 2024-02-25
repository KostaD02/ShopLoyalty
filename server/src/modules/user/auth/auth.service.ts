import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateUser(email: string, password: string) {
    return null;
  }
}
