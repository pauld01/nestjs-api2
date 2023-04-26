import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './auth/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './auth/strategies/refreshToken.strategy';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest_api_2'),
    UsersModule,
    AuthModule,
    JwtModule.register({}),
  ],
  controllers: [AppController],
  providers: [AppService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AppModule {}
