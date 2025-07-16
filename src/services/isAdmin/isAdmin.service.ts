import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
export class IsAdminService {
  constructor(private readonly userService: UserService) {}

  async isAdmin(id: number): Promise<boolean> {
    const user = await this.userService.findOne(id);
    return user?.isAdmin ?? false;
  }
}