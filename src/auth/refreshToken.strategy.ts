/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_SECRET,
        })
    }

    ValidityState(req: Request, payload: any) {
        const refreshToken = req.get('Authorization').replace('bearer','').trim()
        return {...payload, refreshToken};
    }
}