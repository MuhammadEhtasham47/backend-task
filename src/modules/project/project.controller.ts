import { Controller, Get, Post, Put, Param, Body, Headers, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { UserService } from '../user/user.service';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService
  ) {}

  @Get()
  async getAllProjects(
    @Headers('Authorization') authHeader: string,
    @Query('page') page = 1, // Default page
    @Query('limit') limit = 10 // Default limit
  ) {
    page = Number(page);
    limit = Number(limit);
    const user = await this.userService.verifyToken(authHeader);
    console.log('User from token:', user);

    if (user.role === 'admin') {
      return this.projectService.findAll(page, limit);
    } else if (user.role === 'manager') {
      return this.projectService.findProjectsByManager(user._id, page, limit);
    } else if (user.role === 'member') {
      return this.projectService.findProjectsByMember(user._id, page, limit);
    } else {
      throw new Error('Unauthorized access');
    }
  }

  @Get(':id')
  async getProjectById(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string
  ) {
    const user = await this.userService.verifyToken(authHeader);
    console.log('User attempting to access project:', user);
    return this.projectService.checkProjectAccess(user, id);
  }

  @Post()
  async createProject(
    @Body() projectData: CreateProjectDto,
    @Headers('Authorization') authHeader: string
  ) {
    const user = await this.userService.verifyToken(authHeader);
    console.log('User creating project:', user);
    this.userService.checkRole(user, ['admin', 'manager']);
    return this.projectService.createProject(projectData);
  }

  @Put(':id')
  async updateProject(
    @Param('id') id: string,
    @Body() updateData: UpdateProjectDto,
    @Headers('Authorization') authHeader: string
  ) {
    const user = await this.userService.verifyToken(authHeader);
    console.log('User updating project:', user);
    this.userService.checkRole(user, ['admin', 'manager']);
    return this.projectService.updateProject(id, updateData);
  }
}