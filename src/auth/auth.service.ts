// src/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  Post,
} from '@nestjs/common';

//DATABASE
import { PrismaService } from '../prisma/prisma.service';

//TYPES
import type { Login, Casdastro } from 'src/types/Auth';
import type { JwtPayload } from '../types/JwtPayload';

//AUTENTICAÇÃO E CRYPTOGRAFIA
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

//EXPRESS
import type { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Declaração da blacklist
  private tokenBlacklist: Set<string> = new Set();

  /********************************************** CADASTRO *******************************************/
  async cadastrar(user: Casdastro) {
    //desfragmentação
    const { nome, cpf, email, senha } = user;

    //Verifica se o CPF é inválido
    const cpfClean = cpf.trim();

    if (!cpfClean) {
      throw new ConflictException('CPF inválido');
    }
    /********************************************************/

    //Verificar se cpf já está cadastrado
    const userDB = await this.prisma.usuario.findUnique({
      where: {
        cpf: cpfClean,
      },
    });

    if (userDB) {
      throw new ConflictException('CPF já cadastrado');
    }
    /************************************************************/

    //Criptografia
    const salt = await bcrypt.genSalt(10);
    const hashSenha = await bcrypt.hash(senha, salt);
    /***********************************************************/

    //INSERT na tabela
    const usuario = await this.prisma.usuario.create({
      data: {
        nome,
        cpf,
        email,
        senha: hashSenha,
      },
    });

    const { senha: _, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /*********************************************** AUTENTICAÇÃO ***************************************************/
  async login(user: Login) {
    console.log('Usuario recebido:', user);

    const { cpf, senha } = user;

    //Verifica se o usuario existe
    const usuarioDB = await this.prisma.usuario.findUnique({
      where: { cpf },
    });

    if (!usuarioDB) {
      console.log('Usuário não encontrado');
      throw new NotFoundException('Usuário não encontrado');
    }
    /************************************************************** */

    //Validação de senha
    const senhaConfere = await bcrypt.compare(senha, usuarioDB.senha);
    //const senhaConfere: boolean = senha === usuarioDB.senha

    if (!senhaConfere) {
      console.log('Senha incorreta');
      throw new UnauthorizedException('Senha incorreta');
    }
    /************************************************************ */

    /************** Se a autenticação for valida ************************ */

    const payload: JwtPayload = {
      sub: usuarioDB.id,
      nome: usuarioDB.nome,
    };

    const token = this.jwtService.sign(payload);

    console.log('Usuario conectado:', payload, new Date());
    return {
      token: token,
    };
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////// LOGOUT //////////////////////////////////
  invalidateToken(req: Request) {
    const token = req.cookies['token'];
    if (token) {
      // Exemplo: adicionar à blacklist ou remover sessão do Redis
      this.tokenBlacklist.add(token);
    }
  }
  ///////////////////////////////////////////////////////////////////////
}
