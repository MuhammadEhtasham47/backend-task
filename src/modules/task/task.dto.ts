export class CreateTaskDto {
    title: string;
    description: string;
    status?: 'To Do' | 'In Progress' | 'Completed';
    projectId: string;
    assignedTo?: string;
    dueDate: Date;
  }
  
  export class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: 'To Do' | 'In Progress' | 'Completed';
    projectId?: string;
    assignedTo?: string;
    dueDate?: Date;
  }
  