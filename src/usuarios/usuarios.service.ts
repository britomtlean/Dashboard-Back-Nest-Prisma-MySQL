import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggedUser } from 'src/types/LoggedUser';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async listarUsers() {
    const listUsers = await this.prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        cpf: true,
        email: true,
        senha: false,
      },
    });
    return listUsers;
  }

  async updateUser(userBody: any, userReq: LoggedUser){
    console.log('Solicitação para atualização de dados:', userBody, new Date())
    const { email, nome } = userBody

    const userUpdate = await this.prisma.usuario.update({
      where:{
        id: userReq.id
      },
      data:{
        nome,
        email
      }
    })

    return userUpdate
  }
}
