// Updated ProjectSchema with ObjectId References
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true, trim: true })
  projectName: string;

  @Prop({ required: true, trim: true })
  projectDescription: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  projectManager: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  members: Types.ObjectId[];

  @Prop({ type: String, enum: ['Scheduled', 'In Progress', 'Completed'], default: 'Scheduled' })
  status: 'Scheduled' | 'In Progress' | 'Completed';

  @Prop({ default: false })
  deleted: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);