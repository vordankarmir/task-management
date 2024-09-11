import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UsePipes,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, createTaskSchema } from './dto/create-task.dto';
import { UpdateTaskDto, updateTaskSchema } from './dto/update-task.dto';
import { JoiValidationPipe } from '../../pipes/validation.pipe';
import * as Joi from 'joi';
import { ReportQueryDto, reportQueryParams } from './dto/report.dto';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Task } from './entities/task.entity';
import { Report as TaskReport } from './types';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Create Task' })
  @ApiResponse({ status: 200, description: 'Created', type: Task })
  @Post()
  @UsePipes(new JoiValidationPipe(createTaskSchema))
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @ApiOperation({ summary: 'Get Report' })
  @ApiResponse({ status: 200, description: 'Created', type: TaskReport })
  @ApiQuery({
    name: 'memberId',
    example: 'e2b5ea37-1c02-4bd1-b912-1b09cc08b52c',
    required: false,
  })
  @ApiQuery({
    name: 'startDate',
    example: '1725825600000',
    required: false,
  })
  @ApiQuery({
    name: 'endDate',
    example: '1725825600000',
    required: false,
  })
  @Get('/report')
  async getReport(
    @Query(new JoiValidationPipe(reportQueryParams)) query: ReportQueryDto,
  ) {
    const { memberId, startDate, endDate } = query;
    return this.taskService.getReport(
      memberId,
      parseInt(startDate, 10),
      parseInt(endDate, 10),
    );
  }

  @ApiOperation({ summary: 'Get task by id' })
  @ApiResponse({
    status: 200,
    description: 'Find task by id',
    type: Task,
  })
  @ApiResponse({
    status: 400,
    description: 'Task id is required',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  @Get('/:id')
  async findOne(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
  ) {
    return this.taskService.findOne(id);
  }

  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({
    status: 200,
    description: 'Update task',
    type: null,
  })
  @ApiResponse({
    status: 400,
    description: 'Task id is required',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  @ApiBody({ type: UpdateTaskDto })
  @Put('/:id')
  @UsePipes(new JoiValidationPipe(updateTaskSchema))
  async update(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, updateTaskDto);
  }

  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({
    status: 200,
    description: 'Delete task',
    type: null,
  })
  @Delete('/:id')
  async remove(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
  ) {
    return this.taskService.remove(id);
  }
}
