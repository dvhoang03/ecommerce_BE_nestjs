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
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey: process.env.JWT_SECRET ,
        });
    };


    async validate(payload: any) {
        const user = await this.usersService.findBy(payload.email);
        if( !user ){
            throw new UnauthorizedException("email or password is not correct");
        }
        return user;
    }
}
