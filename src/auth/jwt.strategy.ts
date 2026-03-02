/*CÓDIGO PARA VALIDAÇÃO DE TOKEN JWT

PassportStrategy - MÉTODO QUE CHAMA CLASSE PARA AUTENTICAÇÃO
Strategy - CLASSE QUE DEFINE AUTENTICAÇÃO JWT

*/

import { Injectable, UnauthorizedException } from '@nestjs/common';

//JWT
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

//COOKIE
import { Request } from 'express';

//TYPE
import type { JwtPayload } from '../types/JwtPayload'
import type { UsuarioLogado } from 'src/types/UsuarioLogado';

//PRISMA
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  //VALIDA O TOKEN E EXTRAI O PAYLOAD
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        //EXTRAI TOKEN VIA COOKIE
        (request: Request) => {
          return request?.cookies?.token;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET as string, //RECEBE A CHAVE JWT PARA VALIDAÇÃO
    });
  }

  async validate(payload: JwtPayload) {
    const usuario: UsuarioLogado | null = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        nome: true,
        cpf: true,
        email: true
      },
    });


    if (!usuario) {
      console.log('Usuário não encontrado')
      throw new UnauthorizedException("Erro de Login");
    }

    console.log('Usuario enviado:', usuario)
    return usuario;
  }
}
