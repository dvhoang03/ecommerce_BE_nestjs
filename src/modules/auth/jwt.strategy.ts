import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    
    constructor( private usersService: UsersService){
        if(!process.env.JWT_SECRET){
            throw new NotFoundException("not find key-jwt")
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),// Lấy token từ header "Authorization: Bearer <token>"
            ignoreExpiration:false,
            secretOrKey: process.env.JWT_SECRET ,// Phải khớp với secret trong JwtModule
        });
    };


    async validate(payload: any) {
        // Payload là dữ liệu được giải mã từ token
        
        const user = await this.usersService.findBy(payload.email);
        if( !user ){
            throw new UnauthorizedException("email or password is not correct");
        }
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}
