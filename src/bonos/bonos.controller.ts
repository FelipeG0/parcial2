import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BonosService } from './bonos.service';
import { CreateBonoDto } from './dto/create-bono.dto';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';

@Controller('bonos')
export class BonosController {
  constructor(private readonly bonosService: BonosService) {}

  @Post()
  create(@Body() createBonoDto: CreateBonoDto) {
    return this.bonosService.create(createBonoDto);
  }

  @Get('codigo/:codigo')
  async findBonoByCodigo(@Param('codigo') codigo: string) {

    const bono = await this.bonosService.findBonoByCodigo(codigo);
    if (!bono) {
      throw new BusinessLogicException('no se encontro un bono asociado a ese codigo', BusinessError.NOT_FOUND);
    }
    return bono;

  }

  @Get('usuario/:usuarioId')
  async findAllBonosByUsuario(@Param('usuarioId') usuarioId: number) {

    const bonos = await this.bonosService.findAllBonosByUsuario(usuarioId);
    if (!bonos.length) {
      throw new BusinessLogicException("el usuario no tiene bonos", BusinessError.NOT_FOUND);
    }
    return bonos;

  }

  @Delete(':id')
  async deleteBono(@Param('id') id: number) {

    await this.bonosService.deleteBono(id);
    return { message: "Bono eliminado" };

  }
}
