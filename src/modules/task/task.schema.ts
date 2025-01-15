import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: String, enum: ['To Do', 'In Progress', 'Completed'], default: 'To Do' })
  status: 'To Do' | 'In Progress' | 'Completed';

  @Prop({ required: true, type: Types.ObjectId, ref: 'Project' })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedTo?: Types.ObjectId;

  @Prop({ required: true, type: Date })
  dueDate: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
