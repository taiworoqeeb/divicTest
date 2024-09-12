import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from 'src/user/dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
        private configService: ConfigService,
        private prismaService: PrismaService
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract the JWT from the authorization header
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Get the JWT secret key from the configuration
    });
  }

  async validate(payload: UserPayload): Promise<Partial<User> | null> {
    // The validate method is invoked when the JWT is validated. Return a user object or other data that you want to attach to the request.

    const user = await this.prismaService.user.findUnique({
        where:{
            id: payload.id
        }
    })

    if(!user){
        return null
    }

    return user  //This is done to get rid of unauthorized individual that is not a user on the platform.


  }
}
