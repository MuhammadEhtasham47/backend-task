import { Controller, Get, Param } from '@nestjs/common';
import { TaskService } from './task.service';
import { Types } from 'mongoose';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('summary')
  async getTaskCompletionSummary() {
    console.log('Fetching task completion summary');
    return this.taskService.getTaskCompletionSummary();
  }

  @Get('overdue')
  async getOverdueTasksSummary() {
    console.log('Fetching overdue task summary');
    return this.taskService.getOverdueTasksSummary();
  }

  @Get('performance/:userId')
  async getUserPerformanceReport(@Param('userId') userId: string) {
    console.log('Fetching performance report for user:', userId);
    return this.taskService.getUserPerformanceReport(new Types.ObjectId(userId));
  }

  @Get('project-summary/:projectId')
  async getProjectTaskSummary(@Param('projectId') projectId: string) {
    console.log('Fetching task summary for project:', projectId);
    return this.taskService.getProjectTaskSummary(new Types.ObjectId(projectId));
  }
}
