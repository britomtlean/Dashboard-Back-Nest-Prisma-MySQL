import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { PrismaService } from 'src/prisma/prisma.service';
import type { ReqExercise, ReqTraining } from 'src/types/Training';
import { LoggedUser } from 'src/types/LoggedUser';

@Injectable()
export class TreinoService {
  constructor(private readonly prisma: PrismaService) {}

  /*************************** ENVIAR MUSCULO PARA TREINAR ************************ */
  async sendMuscleForTraining() {
    const muscle = await this.prisma.tipoTreino.findMany({});

    console.log('Musculos enviados:', muscle, new Date());
    return muscle;
  }


  /********************************* ENVIAR EXERCICIOS POR MUSCULO ************************************** */
  async sendExercisesForTraining() {
    const exercises = await this.prisma.subTipoTreino.findMany({
      include: {
        TipoTreino: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    console.log('Exercicios enviados:', exercises, new Date());
    return exercises;
  }

  /**************************************** ENVIAR TODOS OS TREINOS ********************************** */
  async sendAllTrainings(user: LoggedUser) {

    const trainings = await this.prisma.treino.findMany({
      where: {
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

    console.log('Treinos enviados:', trainings, new Date());
    return trainings;
  }

  /************************************* CRIAR TREINO *********************************** */
  async createTraining(
    training: ReqTraining,
    user: LoggedUser,
  ): Promise<Record<string, any>> {

    console.log('Usuario logado: '+user.id, new Date(), 'Treino recebido:', training);

    if (training.diaSemana < 1 || training.diaSemana > 7) {
      throw new NotFoundException('Dia da semana incompatível');
    }

    const verifyTraining = await this.prisma.treino.findMany({
      where:{
        id_usuario: user.id,
        id_TipoTreino: training.musculo,
        diaSemana: training.diaSemana
      }
    })

    if (verifyTraining.length > 0){
      throw new NotFoundException('Já existe um treino criado para este dia!');
    }

      const newTraining = await this.prisma.treino.create({
        data: {
          id_TipoTreino: training.musculo,
          diaSemana: training.diaSemana,
          id_usuario: user.id,
        },
      });

    console.log('Treino criado:', newTraining, new Date());
    return newTraining;
  }


  /*********************************** CRIAR EXERCICIO NO TREINO *********************************** */
  async createExerciseInTraining(
    exercise: ReqExercise,
    user: LoggedUser
  ): Promise<Record<string, any>> {

    console.log('Usuario logado: '+user.id+""+new Date(), 'Exercicio recebido:', exercise)

    const verifyExercise = await this.prisma.exercicio.findMany({
      where: {
        id_Treino: exercise.idTreino,
        id_SubTipoTreino: exercise.idSubTipoTreino
      }
    })

    if(verifyExercise.length > 0){
      throw new NotFoundException('Ja existe um exercicio criado para este dia!')
    }

    const newExercise = await this.prisma.exercicio.create({
      data: {
        id_Treino: exercise.idTreino,
        id_SubTipoTreino: exercise.idSubTipoTreino,
        serie: exercise.serie,
      },
    });

    console.log('Exercicio adicionado:', newExercise, new Date());
    return newExercise;
  }


  /*************************** Apagar Treino **************************/
  async deleteTraining(body: Record<string, any>, user: LoggedUser){

    console.log(`Usuario logado: `,+user.id, new Date(), `id recebido:`, body.id)

    const trainingDropped = await this.prisma.treino.delete({
      where: {
        id_usuario: user.id,
        id: body.id
      }
    })

    console.log(`Treino deletado: ${trainingDropped}`, new Date());
    return trainingDropped
  }

}
