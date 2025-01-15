import { Types } from 'mongoose';
export class CreateProjectDto {
    projectName: string;
    projectDescription: string;
    projectManager: string | Types.ObjectId; // Allow both string and ObjectId for flexibility
    members: (string | Types.ObjectId)[];   // Allow both string and ObjectId for members
    status?: 'Scheduled' | 'In Progress' | 'Completed'; // Optional with default value
  }
  
  export class UpdateProjectDto {
    projectName?: string;
    projectDescription?: string;
    projectManager?: string;
    members?: string[];
    status?: 'Scheduled' | 'In Progress' | 'Completed';
  }