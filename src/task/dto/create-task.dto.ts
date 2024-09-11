import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Title',
  })
  title: string;

  @ApiProperty({
    example: 'Description',
  })
  description: string;

  @ApiProperty({
    example: '1725825600000',
  })
  dueDate: number;

  @ApiProperty({
    example: 'true',
  })
  priority: boolean;

  @ApiProperty({
    example: 'e2b5ea37-1c02-4bd1-b912-1b09cc08b52c',
  })
  assignedMember: string;
}

export const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  dueDate: Joi.number().required(),
  priority: Joi.boolean().required(),
  assignedMember: Joi.string().required(),
});
