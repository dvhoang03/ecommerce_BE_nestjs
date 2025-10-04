import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class EmailUniqueGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = request.body.email; // Lấy email từ body của request

    // Kiểm tra xem email đã tồn tại chưa
    const user = await this.usersService.findUserByEmail(email);
    if (user) {
      throw new BadRequestException('Email already exists');
    }

    return true; // Nếu email chưa tồn tại, cho phép request đi tiếp
  }
}
