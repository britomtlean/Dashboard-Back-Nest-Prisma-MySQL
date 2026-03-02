import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

//TYPE
import type { UsuarioLogado } from 'src/types/UsuarioLogado';

type Task = {
  desc: string;
};

@Injectable()
export class TarefasService {
  constructor(private readonly prisma: PrismaService) {}

  //CRIAR TASK
  async createTask(login: UsuarioLogado, task: Task) {
    console.log('Identificação:',login, "Task: "+task.desc);

    const newTask = await this.prisma.tarefa.create({
      data: {
        desc: task.desc,
        usuarioId: login.id
      },
    });

    return newTask;
  }
////////////////////////////////////////////////////////////


  //ENVIA TASK PARA O USUÁRIO INSERIDO NO PAYLOAD
  async getTask(login: UsuarioLogado) {
    console.log('Identificação:', login);

    const { id } = login;

    const tasks = await this.prisma.tarefa.findMany({
        where: {usuarioId: id},
        select: {desc: true}
    })

    return tasks
  }
  ///////////////////////////////////////////////////////////
}
