import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from './task.schema';
import Redis from 'ioredis';

@Injectable()
export class TaskService {
    private redisClient: Redis;

    constructor(@InjectModel('Task') private taskModel: Model<Task>) {
      this.redisClient = new Redis({
        host: process.env.HOST,
        port: 14093,
        password: process.env.REDIS_PASS, 
      });
    }
  
    private async getCache(key: string): Promise<any | null> {
      const cachedData = await this.redisClient.get(key);
      return cachedData ? JSON.parse(cachedData) : null;
    }
  
    private async setCache(key: string, value: any, ttl = 3600): Promise<void> {
      await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
    }

    async getTaskCompletionSummary() {
        const cacheKey = 'taskCompletionSummary';
        console.log('Checking cache for task completion summary...');
        const cachedSummary = await this.getCache(cacheKey);
    
        if (cachedSummary) {
          console.log('Cache hit for task completion summary');
          return cachedSummary;
        }
    
        console.log('Cache miss. Aggregating task completion summary...');
        const summary = await this.taskModel.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ]);
    
        await this.setCache(cacheKey, summary);
        return summary;
      }
    
      async getOverdueTasksSummary() {
        const cacheKey = 'overdueTasksSummary';
        console.log('Checking cache for overdue tasks summary...');
        const cachedSummary = await this.getCache(cacheKey);
    
        if (cachedSummary) {
          console.log('Cache hit for overdue tasks summary');
          return cachedSummary;
        }
    
        console.log('Cache miss. Aggregating overdue tasks summary...');
        const currentDate = new Date();
        const summary = await this.taskModel.aggregate([
          {
            $match: {
              dueDate: { $lt: currentDate },
              status: { $ne: 'Completed' },
            },
          },
          {
            $lookup: {
              from: 'projects',
              localField: 'projectId',
              foreignField: '_id',
              as: 'project',
            },
          },
          {
            $unwind: {
              path: '$project',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: '$projectId',
              projectName: { $first: '$project.projectName' },
              count: { $sum: 1 },
            },
          },
        ]);
    
        await this.setCache(cacheKey, summary);
        return summary;
      }

  async getUserPerformanceReport(userId: Types.ObjectId) {
    console.log('Fetching performance report for user:', userId);

    const performance = await this.taskModel.aggregate([
      {
        $match: {
          assignedTo: userId,
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    console.log('User performance report:', performance);
    return performance;
  }

  async getProjectTaskSummary(projectId: Types.ObjectId) {
    console.log('Fetching task summary for project:', projectId);

    const statuses = ['To Do', 'In Progress', 'Completed'];

    const taskSummary = await this.taskModel.aggregate([
      {
        $match: {
          projectId: projectId,
        },
      },
      {
        $group: {
          _id: {
            status: '$status',
            assignedTo: '$assignedTo',
          },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id.assignedTo',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id.status',
          totalTasks: { $sum: '$count' },
          users: {
            $push: {
              user: '$userDetails.fullName',
              count: '$count',
            },
          },
        },
      },
    ]);

    const summaryWithDefaults = statuses.map((status) => {
      const statusSummary = taskSummary.find((s) => s._id === status) || {
        _id: status,
        totalTasks: 0,
        users: [],
      };
      return statusSummary;
    });

    console.log('Enhanced project task summary with defaults:', summaryWithDefaults);
    return summaryWithDefaults;
  }
}