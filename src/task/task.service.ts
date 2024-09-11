import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '../../schemas/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TASK_STATUS } from './types';
import * as moment from 'moment';
import { Report } from './types';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      status: TASK_STATUS.IN_PROGRESS,
    });

    return createdTask.save();
  }

  async findOne(id: string): Promise<Task | null> {
    const task = await this.taskModel.findById(id);

    if (task == null) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    await this.findOne(id);

    const updatedTask = await this.taskModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        ...updateTaskDto,
        completedDate: new Date(),
      },
      {
        returnOriginal: false,
      },
    );

    return updatedTask;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.taskModel.deleteOne({
      _id: id,
    });

    return result.acknowledged;
  }

  async getReport(
    memberId: string,
    startDate: number,
    endDate: number,
  ): Promise<Report> {
    const completedTasksData = await this.taskModel.aggregate([
      {
        $match: {
          $or: [
            { assignedMember: memberId },
            { completedDate: { $gt: startDate, $lt: endDate } },
            { status: 'COMPLETED' },
          ],
        },
      },
      {
        $facet: {
          memberTasks: [
            {
              $match: {
                assignedMember: {
                  $eq: memberId,
                },
              },
            },
          ],
          tasksInPeriod: [
            {
              $match: {
                completedDate: {
                  $gt: startDate,
                  $lt: endDate,
                },
              },
            },
          ],
          completedTasks: [
            {
              $match: {
                status: {
                  $eq: 'COMPLETED',
                },
              },
            },
          ],
        },
      },
    ]);

    const { memberTasks, tasksInPeriod, completedTasks } =
      completedTasksData[0];

    let totalCompletionTime = 0;

    for (let i = 0; i < completedTasks.length; i++) {
      totalCompletionTime += moment(
        new Date(completedTasks[i].completedDate).getTime(),
      ).diff(moment(completedTasks[i].createdAt), 'seconds');
    }
    const avaregeCompletionTime = Math.round(
      totalCompletionTime / completedTasks.length,
    );

    return {
      memberTasks,
      tasksInPeriod,
      totalCompletedTasks: completedTasks.length,
      avaregeCompletionTimeInSeconds: avaregeCompletionTime,
    };
  }
}
