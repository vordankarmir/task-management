import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { TASK_STATUS } from '../types';
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    enum: ['IN_PROGRESS', 'COMPLETED'],
  })
  status: TASK_STATUS;
}

export const updateTaskSchema = Joi.object({
  status: Joi.string().required(),
});
