import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { TASK_STATUS } from '../src/task/types';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  _id: string;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  status: TASK_STATUS;

  @Prop({
    required: true,
  })
  dueDate: number;

  @Prop({
    required: true,
  })
  priority: boolean;

  @Prop({
    required: true,
  })
  assignedMember: string;

  @Prop({
    required: false,
  })
  completedDate: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
