/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as argon2 from 'argon2'

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    //on cherche l'existence du user dans la DB
    const userExists = await this.userService.findByUsername(createUserDto.username);

    if(userExists) {
      throw new BadRequestException('L\'utilisateur existe déjà')
    }

    const hash = await this.hashData(createUserDto.password);

    const newUser = await this.userService.create({...createUserDto, password: hash});

    const tokens = await this.getTokens(newUser._id, newUser.username);

    await this.updateRefreshToken(newUser._id, newUser.username);
  }

  async signIn(data: AuthDto) {
    const user = await this.userService.findByUsername(data.username);

    if(!user) {
      throw new BadRequestException('utilisateur inconnu');
    }
    const passwordOk = await argon2.verify(user.password, data.password);

    if(!passwordOk){
      throw new BadRequestException('Identifiant ou mot de passe incorrect');
    }
    
    const tokens = await this.getTokens(user._id, user.username);
    await this.updateRefreshToken(user._id, user.username);
  }

  async logout(userId: string) {
    return this.userService.update(userId, {
      refreshToken:null
    })
  }

  hashData(data:string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);

    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken
    })
  }

  async getTokens(userId: string, username: string) {
    //on force js à attendre 
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({
        sub: userId, 
        username
      },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync({
        sub: userId,
        username
      },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      })
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
