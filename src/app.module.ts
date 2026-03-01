import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsuariosService } from './usuarios/usuarios.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PrismaModule } from './prisma/prisma.module';
import { TarefasService } from './tarefas/tarefas.service';
import { TarefasController } from './tarefas/tarefas.controller';
import { TarefasModule } from './tarefas/tarefas.module';

@Module({
  imports: [UsuariosModule, PrismaModule, TarefasModule],
  controllers: [AppController, TarefasController],
  providers: [AppService, PrismaService, UsuariosService, TarefasService],
})
export class AppModule {}
