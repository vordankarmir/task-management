import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Model } from 'mongoose';
import { Task } from '../../schemas/task.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('TaskController', () => {
  let controller: TaskController;
  let taskModel: Model<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        { provide: getModelToken(Task.name), useValue: taskModel },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
