import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  async createUser(userData: { fullName: string; email: string; password: string }): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async verifyToken(authHeader: string): Promise<any> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid token');
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token, { secret: 'yourSecretKey' });
      const user = await this.getUserById(decoded.id);
      if (!user) {
        throw new Error('Unauthorized');
      }
      return user;
    } catch (err) {
      throw new Error('Token verification failed');
    }
  }

  checkRole(user: any, roles: string[]): void {
    if (!roles.includes(user.role)) {
      throw new Error('Forbidden: Insufficient permissions');
    }
  }
}