import { Module } from '@nestjs/common';
import { TarefasController } from './tarefas.controller';
import { TarefasService } from './tarefas.service';

@Module({
      imports: [],
      controllers: [TarefasController], //Rotas
      providers: [TarefasService], //Services
      exports: [],
})
export class TarefasModule {}
