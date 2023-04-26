/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/users.schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createUser = new this.userModel(createUserDto);
    return createUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  async findByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({username}).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true}).exec();
  }

  async remove(id: number): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
