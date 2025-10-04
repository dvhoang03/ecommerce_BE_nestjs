import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { PayLoadDTO } from './dto/payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(private usersService: UsersService) {
    if (!process.env.JWT_SECRET) {
      throw new NotFoundException('not find key-jwt');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy token từ header "Authorization: Bearer <token>"
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // Phải khớp với secret trong JwtModule
    });
  }

  // validate(...args: any[]): unknown {
  //   throw new Error('Method not implemented.');
  // }

  async validate(payload: PayLoadDTO) {
    // Payload là dữ liệu được giải mã từ token
    const user = await this.usersService.findUserByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('sai tai khoan hoac mat khau');
    }
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
