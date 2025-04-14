import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) { };

    async validateUser(email: string, pass: string): Promise<Partial<User> | null> {
        const user = await this.userService.findUserByEmail(email);
        console.log(user)
        if (user && bcrypt.compareSync(pass, user.password)) {

            return user;
        }
        return null;
    }

    async login(user: Partial<User>) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        const { password, ...results } = user;
        return {
            access_token: this.jwtService.sign(payload),
            user: results
        }
    }

    async register(user: CreateUserDto): Promise<User> {
        const passwordHash = bcrypt.hashSync(user.password, 10);
        user.password = passwordHash;
        return this.userService.create(user);
    }
}
