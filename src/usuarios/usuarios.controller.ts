import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { Usuario } from './entities/usuario.entity';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

  @Get(':usuarioId')
  async findOne(@Param('usuarioId') userId: number) {
    return await this.usuariosService.findById(userId);
  }

  @Post()
  async create(@Body() usuarioDto: Usuario) {
    const usuario: Usuario = plainToInstance(Usuario, usuarioDto);
    return await this.usuariosService.create(usuario);
  }

  @Delete(':usuarioId')
  @HttpCode(204)
  async delete(@Param('usuarioId') userId: number) {
    return await this.usuariosService.remove(userId);
  }
}
