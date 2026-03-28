import { Controller, Get, Post, UseGuards, Body, Req, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { ReqExercise, ReqTraining } from 'src/types/Training';
import { TreinoService } from './treino.service';

@Controller('/training')
export class TreinoController {
  constructor(private readonly service: TreinoService) {}

  @Post('/post-training')
  @UseGuards(AuthGuard('jwt'))
  createTraining(@Body() training: ReqTraining, @Req() req: any) {
    return this.service.createTraining(training, req.user);
  }

  @Post('/post-exercise')
  @UseGuards(AuthGuard('jwt'))
  addExercise(@Body() exercise: ReqExercise, @Req() req: any) {
    return this.service.createExerciseInTraining(exercise, req.user);
  }

  /************************* GET ******************************** */
  @Get('/get-muscles')
  @UseGuards(AuthGuard('jwt'))
  sendTypesTraining(){
    return this.service.sendMuscleForTraining()
  }

  @Get('/get-exercises')
  @UseGuards(AuthGuard('jwt'))
  sendTypesExercises(){
    return this.service.sendExercisesForTraining()
  }

  @Get('/get-alltrainings')
  @UseGuards(AuthGuard('jwt'))
  sendTrainingDay(@Req() req: any) {
    return this.service.sendAllTrainings(req.user);
  }

  /************************ Delete ************************* */

  @Delete('/delete-training')
  @UseGuards(AuthGuard('jwt'))
  deleteTraining(@Body() body: Record<string, any>, @Req() req: any){
    return this.service.deleteTraining(body, req.user)
  }
}
