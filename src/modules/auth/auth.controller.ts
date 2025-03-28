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
    @ApiConsumes('application/json')
    @ApiBody({
        description: 'login system',
        type: LoginDTO,
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    @Post('login')
    async login(@Body() user: LoginDTO) {

        const u = await this.authService.validateUser(user.email, user.password);
        if (!u) {
            throw new UnauthorizedException("email or password is wrong")
        }
        return this.authService.login(u);
    }

    @Public()
    @ApiOperation({ summary: 'register a  new user' })
    @ApiResponse({ status: 201, description: 'Đăng nhập thành công và trả về JWT token' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @Post('register')
    async register(@Body() user: CreateUserDto) {
        return this.authService.register(user);
    }

    @Get('hello')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: " hello the world" })
    @ApiResponse({ status: 200, description: "Successfully! " })

    hello(@Req() body) {
        console.log(body)
        return JSON.stringify(body.user);
    }
}
