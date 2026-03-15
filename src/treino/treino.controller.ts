import { Controller, Get, Post, UseGuards, Body, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { TrainingBody, ExerciseBody } from 'src/types/Training';
import { TreinoService } from './treino.service';

@Controller('/training')
export class TreinoController {
  constructor(private readonly service: TreinoService) {}

  @Post('/create')
  @UseGuards(AuthGuard('jwt'))
  createTraining(@Body() training: TrainingBody, @Req() req: any) {
    return this.service.createTraining(training, req.user);
  }

  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  addExercise(@Body() exercise: ExerciseBody) {
    return this.service.addExercise(exercise);
  }

  /************************* GET ******************************** */
  @Get('/getTypes')
  @UseGuards(AuthGuard('jwt'))
  sendTypesTraining(){
    return this.service.sendTypesTraining()
  }

  @Get('/getExercises')
  @UseGuards(AuthGuard('jwt'))
  sendTypesExercises(){
    return this.service.sendTypesExercises()
  }

  @Get('/getDay')
  @UseGuards(AuthGuard('jwt'))
  sendTrainingDay(@Req() req: any) {
    return this.service.sendTrainingDay(req.user);
  }
}
