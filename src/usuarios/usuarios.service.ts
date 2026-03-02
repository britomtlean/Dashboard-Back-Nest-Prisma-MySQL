import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsuariosService {
constructor(private readonly prisma: PrismaService){}

async listarUsers(){
    const listUsers = await this.prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        cpf: true,
        email: true,
        senha: false,
      },
    });
    return listUsers
}

}
