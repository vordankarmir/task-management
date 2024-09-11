import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { Task, TaskSchema } from '../../schemas/task.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { dummyId, taskMock } from '../../test/stubs/task.dto.stub';
import { TASK_STATUS } from './types';
import { NotFoundException } from '@nestjs/common';
import * as moment from 'moment';

describe('TaskService', () => {
  let taskService: TaskService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let taskModel: Model<Task>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    taskModel = mongoConnection.model(Task.name, TaskSchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: getModelToken(Task.name), useValue: taskModel },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('create task', () => {
    it('should create task and return 200 response', async () => {
      const task = await taskService.create(taskMock);

      expect(task).toHaveProperty('_id');
      expect(task.status).toEqual(TASK_STATUS.IN_PROGRESS);
      expect(task.dueDate).toEqual(taskMock.dueDate);
    });
  });

  describe('get task by id', () => {
    it('should get a task by id', async () => {
      const taskRepository = new taskModel(taskMock);
      const createdTask = await taskRepository.save();

      const task = await taskService.findOne(createdTask._id);
      expect(task._id).toEqual(createdTask._id);
      expect(task.dueDate).toEqual(taskMock.dueDate);
    });

    it('should throw 404 if task does not exist', async () => {
      try {
        await taskService.findOne(dummyId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update task', () => {
    it('should find and update task by id', async () => {
      const taskRepository = new taskModel(taskMock);
      const createdTask = await taskRepository.save();

      const updatedTask = await taskService.update(createdTask._id, {
        status: TASK_STATUS.COMPLETED,
      });

      expect(updatedTask._id).toEqual(createdTask._id);
      expect(updatedTask.status).toEqual(TASK_STATUS.COMPLETED);
    });

    it('should throw 404 if task does not exist', async () => {
      try {
        await taskService.update(dummyId, { status: TASK_STATUS.COMPLETED });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('delete task', () => {
    it('should delete task by id', async () => {
      const taskRepository = new taskModel(taskMock);
      const createdTask = await taskRepository.save();

      const deleted = await taskService.remove(createdTask._id);
      expect(deleted).toBeTruthy();
    });
  });

  describe('get tasks report', () => {
    it('should get tasks report data', async () => {
      const tasks = await Promise.all([
        taskService.create(taskMock),
        taskService.create(taskMock),
        taskService.create(taskMock),
      ]);

      await Promise.all(
        tasks.map((t) =>
          taskService.update(t._id, { status: TASK_STATUS.COMPLETED }),
        ),
      );

      const startDate = moment(taskMock.dueDate).subtract(1, 'hour').date();
      const endDate = moment(taskMock.dueDate).add(1, 'hour').date();
      const report = await taskService.getReport(
        taskMock.assignedMember,
        startDate,
        endDate,
      );

      expect(report).toHaveProperty('memberTasks');
      expect(report).toHaveProperty('tasksInPeriod');
      expect(report.totalCompletedTasks).toEqual(3);
      expect(report).toHaveProperty('avaregeCompletionTimeInSeconds');
    });
  });
});
