import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Project, ProjectSchema } from './project.schema';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from '../user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({
      secret: 'yourSecretKey', // Replace with an environment variable
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, UserService],
})
export class ProjectModule {}
