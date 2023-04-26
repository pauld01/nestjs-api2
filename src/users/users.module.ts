/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/users.schemas';
import { User } from './entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: User.name, 
      schema: UserSchema,
    }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
