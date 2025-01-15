import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from './project.schema';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';

@Injectable()
export class ProjectService {
  constructor(@InjectModel('Project') private projectModel: Model<Project>) {}

  async findAll(page: number, limit: number): Promise<any> {
    console.log('Fetching all projects with pagination...');

    const skip = (page - 1) * limit;

    const projects = await this.projectModel.aggregate([
      {
        $match: {
          deleted: false,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'members',
          foreignField: '_id',
          as: 'members',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'projectManager',
          foreignField: '_id',
          as: 'projectManager',
        },
      },
      {
        $unwind: {
          path: '$projectManager',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          projectName: 1,
          projectDescription: 1,
          projectManager: {
            _id: 1,
            fullName: 1,
            email: 1,
          },
          members: {
            _id: 1,
            fullName: 1,
            email: 1,
          },
          status: 1,
          deleted: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const totalProjects = await this.projectModel.countDocuments({ deleted: false });

    return {
      projects,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / limit),
      totalProjects,
    };
  }

  async findProjectsByManager(managerId: Types.ObjectId, page: number, limit: number): Promise<any> {
    console.log('Fetching projects for manager with pagination:', managerId);

    const skip = (page - 1) * limit;

    const projects = await this.projectModel.aggregate([
      {
        $match: {
          deleted: false,
          projectManager: managerId,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'members',
          foreignField: '_id',
          as: 'members',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'projectManager',
          foreignField: '_id',
          as: 'projectManager',
        },
      },
      {
        $unwind: {
          path: '$projectManager',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          projectName: 1,
          projectDescription: 1,
          projectManager: {
            _id: 1,
            fullName: 1,
            email: 1,
          },
          members: {
            _id: 1,
            fullName: 1,
            email: 1,
          },
          status: 1,
          deleted: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const totalProjects = await this.projectModel.countDocuments({ deleted: false, projectManager: managerId });

    return {
      projects,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / limit),
      totalProjects,
    };
  }

  async findProjectsByMember(memberId: Types.ObjectId, page: number, limit: number): Promise<any> {
    console.log('Fetching projects for member with pagination:', memberId);

    const skip = (page - 1) * limit;

    const projects = await this.projectModel.aggregate([
      {
        $match: {
          deleted: false,
          members: { $in: [memberId] },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'members',
          foreignField: '_id',
          as: 'members',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'projectManager',
          foreignField: '_id',
          as: 'projectManager',
        },
      },
      {
        $unwind: {
          path: '$projectManager',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          projectName: 1,
          projectDescription: 1,
          projectManager: {
            _id: 1,
            fullName: 1,
            email: 1,
          },
          members: {
            _id: 1,
            fullName: 1,
            email: 1,
          },
          status: 1,
          deleted: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const totalProjects = await this.projectModel.countDocuments({ deleted: false, members: { $in: [memberId] } });

    return {
      projects,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / limit),
      totalProjects,
    };
  }
  

  async findById(projectId: string): Promise<Project | null> {
    console.log('Fetching project by ID:', projectId);

    const projects = await this.projectModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(projectId),
          deleted: false,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'members',
          foreignField: '_id',
          as: 'members',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'projectManager',
          foreignField: '_id',
          as: 'projectManager',
        },
      },
      {
        $unwind: {
          path: '$projectManager',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          projectName: 1,
          projectDescription: 1,
          projectManager: {
            _id: 1,
            fullName: 1,
            email: 1,
          },
          members: {
            _id: 1,
            fullName: 1,
            email: 1,
          },
          status: 1,
          deleted: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    console.log('Fetched project by ID:', projects[0] || null);
    return projects[0] || null;
  }


  async checkProjectAccess(user: any, projectId: string): Promise<Project | null> {
    console.log('Checking access for user:', user, 'on project ID:', projectId);
    const project = await this.findById(projectId);
    if (!project) {
      console.error('Project not found:', projectId);
      throw new Error('Project not found');
    }
    if (
      user.role === 'admin' ||
      project.projectManager.equals(new Types.ObjectId(user._id)) ||
      project.members.some(member => member.equals(new Types.ObjectId(user._id)))
    ) {
      console.log('Access granted for user:', user._id);
      return project;
    } else {
      console.error('Unauthorized access by user:', user._id);
      throw new Error('Unauthorized access');
    }
  }

  async createProject(projectData: CreateProjectDto): Promise<Project> {
    console.log('Before casting:', projectData);
  
    // Convert `projectManager` and `members` to ObjectId
    projectData.projectManager = new Types.ObjectId(projectData.projectManager);
    projectData.members = projectData.members.map(member => new Types.ObjectId(member));
  
    console.log('After casting to ObjectId:', projectData);
  
    const newProject = new this.projectModel(projectData);
    const savedProject = await newProject.save();
  
    console.log('Project created:', savedProject);
    return savedProject;
  }
  

  async updateProject(
    projectId: string,
    updateData: UpdateProjectDto
  ): Promise<Project | null> {
    console.log('Updating project ID:', projectId, 'with data:', updateData);
    const updatedProject = await this.projectModel.findByIdAndUpdate(projectId, updateData, { new: true }).exec();
    console.log('Project updated:', updatedProject);
    return updatedProject;
  }
}