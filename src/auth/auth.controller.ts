import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';

//TYPE
import type { Login, Casdastro } from 'src/types/Auth';

//MIDDLEWARE
import { AuthGuard } from '@nestjs/passport';

//EXPRESS
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  //ROTA CADASTRO
  @Post('cadastro')
  cadastrar(@Body() user: Casdastro) {
    return this.service.cadastrar(user);
  }

  //ROTA LOGIN -- ENVIA TOKEN --
  @Post('login')
  async login(
    @Body() user: Login,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.service.login(user);

    /*TOKEN VIA COOKIE
    const token = await this.service.login(user);

    //COOKIE ENVIADO
    response.cookie('token', token, {
      httpOnly: true, // 🔥 impede acesso via JS (mais seguro)
      secure: true, // true em produção (https)
      sameSite: 'none', // obrigatório para cross-site
      maxAge: 1000 * 60 * 60, // 1 hora
    });

    return { message: 'Usuário Autenticado' };
    */
  }
  ///////////////////////////////////////////////////////////////

  //VALIDA TOKEN E ENVIA USUÁRIO
  @Get('validate')
  @UseGuards(AuthGuard('jwt'))
  validateProfile(@Req() req: any) {
    return req.user;
  }
  /////////////////////////////////////////////////////////////////

  //LOGOUT
  @Post('logout')
  logout(@Res() res: Response, @Req() req: Request) {
    // 1️⃣ Invalida o token/sessão no servidor
    this.service.invalidateToken(req);

    // 2️⃣ Limpa o cookie HttpOnly
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });

    // 3️⃣ Retorna resposta
    return res.status(200).json({ message: 'Logout realizado com sucesso' });
  }
  /////////////////////////////////////////////////////////
}
