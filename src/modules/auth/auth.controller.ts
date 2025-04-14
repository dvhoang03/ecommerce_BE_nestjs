import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'public/jwt-public';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Public()
    @ApiOperation({ summary: 'login sytem' })
    @UsePipes(new ValidationPipe({ transform: true }))
    @Post('login')
    async login(@Body() request: LoginDTO) {

        const user = await this.authService.validateUser(request.email, request.password);
        if (!user) {
            throw new UnauthorizedException("email or password is wrong")
        }
        return this.authService.login(user);
    }

    @Public()
    @ApiOperation({ summary: 'register a  new user' })
    @Post('register')
    async register(@Body() user: CreateUserDto) {
        return this.authService.register(user);
    }

}
