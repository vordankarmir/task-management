import { ApiProperty } from '@nestjs/swagger';
import { Task } from './entities/task.entity';

export enum TASK_STATUS {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class Report {
  @ApiProperty({
    type: [Task],
  })
  memberTasks: Task[];
  @ApiProperty({
    type: [Task],
  })
  tasksInPeriod: Task[];

  @ApiProperty({
    example: 3,
  })
  totalCompletedTasks: number;

  @ApiProperty({
    example: 2515,
  })
  avaregeCompletionTimeInSeconds: number;
}
