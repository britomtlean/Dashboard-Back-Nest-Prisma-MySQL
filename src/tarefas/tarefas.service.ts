import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

type Task = {
  desc: string;
  cpf: string;
};

@Injectable()
export class TarefasService {
  constructor(private readonly prisma: PrismaService) {}

  //CRIAR TASK
  async createTask(task: Task) {
    console.log(task);

    const user = await this.prisma.usuario.findUnique({
      where: { cpf: task.cpf },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const newTask = await this.prisma.tarefa.create({
      data: {
        desc: task.desc,
        usuarioId: user.id,
      },
    });

    return newTask;
  }
////////////////////////////////////////////////////////////


  //CARREGAR TASK PELO CPF
  async getTask(user: Record<string, string>) {
    console.log(user);

    const { cpf } = user

    const userDB = await this.prisma.usuario.findUnique({
      where: { cpf: cpf },
      select: { id: true },
    });

    if (!userDB) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const tasks = await this.prisma.tarefa.findMany({
        where: {usuarioId: userDB.id},
        select: {desc: true}
    })

    return tasks
  }
  ///////////////////////////////////////////////////////////
}
