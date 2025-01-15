import { Controller, Get, Post, Body, Param, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  @Post('signup')
  async signUp(@Body() userData: { fullName: string; email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await this.userService.createUser({ ...userData, password: hashedPassword });
    return newUser;
  }

  @Post('login')
  async login(@Body() loginData: { email: string; password: string }) {
    const user = await this.userService.findByEmail(loginData.email);
    if (!user || !(await bcrypt.compare(loginData.password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const payload = { id: user._id, email: user.email, role: user.role };
    return { user, token: this.jwtService.sign(payload) };
  }

  @Get(':id')
  async getUserById(@Param('id') id: string, @Headers('Authorization') authHeader: string) {
    const user = await this.userService.verifyToken(authHeader);
    if (!user) {
      throw new Error('Unauthorized access');
    }
    this.userService.checkRole(user, ['admin', 'member']);
    return this.userService.getUserById(id);
  }
}
