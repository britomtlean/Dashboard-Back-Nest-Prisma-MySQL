import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

//TYPE
import type { LoggedUser } from 'src/types/LoggedUser';
import { JwtPayload } from 'src/types/JwtPayload';

type Task = {
  id?: number;
  desc: string;
  status: boolean | null;
};

@Injectable()
export class TarefasService {
  constructor(private readonly prisma: PrismaService) {}

  //CRIAR TASK
  async createTask(login: LoggedUser, task: Task) {
    console.log('Identificação:', login, 'Task: ' + task.desc);

    const newTask = await this.prisma.tarefa.create({
      data: {
        desc: task.desc,
        usuarioId: login.id,
      },
    });

    return newTask;
  }
  ////////////////////////////////////////////////////////////

  //ENVIA TASK PARA O USUÁRIO INSERIDO NO PAYLOAD
  async getTask(login: LoggedUser) {
    console.log('Identificação:', login);

    const tasks: Array<Task> = await this.prisma.tarefa.findMany({
      where: { usuarioId: login.id },
      select: {
        id: true,
        desc: true,
        status: true,
      },
    });

    return tasks;
  }
  ///////////////////////////////////////////////////////////

  //DELETA TASK COM BASE NO ID E USUÁRIO AUTENTICADO
  async deleteTask(id: number, user) {
    //VERIFICA SE O ID DA TAREFA EXISTE E SE ELA PERTENCE AO USUÁRIO AUTENTICADO COM BASE NO PAYLOAD
    const taskVerify = await this.prisma.tarefa.findUnique({
      where: {
        id,
        usuarioId: user.sub,
      },
    });

    if (!taskVerify?.id) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    if (!taskVerify?.usuarioId) {
      throw new NotFoundException(
        'Usuário não possui autorização para realizar esta operação',
      );
    }

    const task = await this.prisma.tarefa.delete({
      where: {
        id: id,
      },
    });

    console.log('Tarefa apagada com sucesso!');
    return {
      message: 'Tarefa apagada com sucesso!',
      task,
    };
  }
  ////////////////////////////////////////////////////////////

  //ATUALIZA TASK COM BASE NO ID E USUÁRIO AUTENTICADO
  async updateTask(id: number, user: JwtPayload) {
    //VERIFICA SE O ID DA TAREFA EXISTE E SE ELA PERTENCE AO USUÁRIO AUTENTICADO COM BASE NO PAYLOAD
    const taskVerify = await this.prisma.tarefa.findUnique({
      where: {
        id,
        usuarioId: user.sub,
      },
    });

    if (!taskVerify?.id) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    if (!taskVerify?.usuarioId) {
      throw new NotFoundException(
        'Usuário não possui autorização para realizar esta operação',
      );
    }

    //CASO TAREFA EXISTE E PERTENÇA AO USUÁRIO LOGADO
    const task = await this.prisma.tarefa.update({
      where: {
        id: id,
      },
      data: {
        status: taskVerify.status ? false : true,
      },
    });

    console.log('Status atualizado com sucesso!');
    return {
      message: 'Status atualizado com sucesso!',
      task,
    };
  }
}
