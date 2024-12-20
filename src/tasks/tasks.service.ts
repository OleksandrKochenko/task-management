import { Injectable, NotFoundException } from '@nestjs/common';
import {
  // Task,
  TaskStatus,
} from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, user } });
    if (!found) {
      throw new NotFoundException(); // NotFoundException(`Task with ID "${id}" not found`) - customize message or use try-catch to customize entire responce
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task: Task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.tasksRepository.save(task);

    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });
    if (result.affected === 0) throw new NotFoundException();
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  async updateTaskDescription(
    id: string,
    description: string,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.description = description;
    await this.tasksRepository.save(task);
    return task;
  }

  async updateTaskTitle(id: string, title: string, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.title = title;
    await this.tasksRepository.save(task);
    return task;
  }
}
