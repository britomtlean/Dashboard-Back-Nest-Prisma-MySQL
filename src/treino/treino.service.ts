import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { PrismaService } from 'src/prisma/prisma.service';
import type { ExerciseBody, TrainingBody } from 'src/types/Training';
import { LoggedUser } from 'src/types/LoggedUser';

@Injectable()
export class TreinoService {
  constructor(private readonly prisma: PrismaService) {}

  /*************************** ENVIAR TIPO DE TREINOS ************************ */
  async sendTypesTraining() {
    const typesTraining = await this.prisma.tipoTreino.findMany({});

    return typesTraining;
  }

  /********************************* ENVIAR EXERCICIOS ************************************** */


  async sendTypesExercises() {
    const typesTraining = await this.prisma.subTipoTreino.findMany({
      include:{
        TipoTreino: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });

    return typesTraining;
  }
  /************************************* CREATE *********************************** */

  async createTraining(
    training: TrainingBody,
    user: LoggedUser,
  ): Promise<Record<string, any>> {
    console.log('usuario logado:', user.id, 'treino recebido:', training);

    if (training.diaSemana < 0 || training.diaSemana > 6) {
      throw new NotFoundException('Dia da semana incompatível');
    }

    const newTraining = await this.prisma.treino.create({
      data: {
        id_TipoTreino: training.musculo,
        diaSemana: training.diaSemana,
        id_usuario: user.id,
      },
    });

    console.log('Novo treino criado:', newTraining, new Date());
    return newTraining;
  }

  /*********************************** ADD EXERCICIO NO TREINO*********************************** */

  async addExercise(exercise: ExerciseBody): Promise<Record<string, any>> {
    const newExercise = await this.prisma.exercicio.create({
      data: {
        id_Treino: exercise.idTreino,
        id_SubTipoTreino: exercise.idSubTipoTreino,
        serie: exercise.serie,
      },
    });

    console.log('Treino adicionado:', newExercise, new Date());
    return newExercise;
  }

  /**************************************** ENVIAR TREINO DO DIA********************************** */

  async sendTrainingDay(user: LoggedUser) {
    const today = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }),
    ).getDay();

    const trainingDay = await this.prisma.treino.findMany({
      where: {
        diaSemana: today,
        id_usuario: user.id,
      },
      include: {
        usuarios: {
          select: {
            nome: true,
          },
        },
        TipoTreino: {
          select: {
            nome: true,
          },
        },
        Exercicio: {
          include: {
            SubTipoTreino: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
    });

    console.log('Treinado registrado:', trainingDay);
    return trainingDay;
  }
}
