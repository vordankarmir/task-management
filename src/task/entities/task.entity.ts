import { ApiProperty } from '@nestjs/swagger';
import { TASK_STATUS } from '../types';

export class Task {
  @ApiProperty({
    example: 'e2b5ea37-1c02-4bd1-b912-1b09cc08b52c',
  })
  _id: string;

  @ApiProperty({
    example: 'Title',
  })
  title: string;

  @ApiProperty({
    example: 'Description',
  })
  description: string;

  @ApiProperty({
    enum: ['IN_PROGRESS', 'COMPLETED'],
  })
  status: TASK_STATUS;

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

  @ApiProperty({
    example: '1725825600000',
  })
  completedDate: number;
}
