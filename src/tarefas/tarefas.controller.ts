import { Controller, Get, Post, Body } from '@nestjs/common';
import { TarefasService } from './tarefas.service';

@Controller('task')
export class TarefasController {
  constructor(private readonly service: TarefasService) {}

  @Get('/')
  async teste() {
    return '<h1>Hello Task</h1>';
  }

  @Post('/create')
  async createTask(@Body() task: any) {
    return await this.service.createTask(task);
  }

  @Post('/get')
  async getTask(@Body() user: any) {
    return await this.service.getTask(user)
  }
}

