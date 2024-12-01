import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CreateBonoDto } from './dto/create-bono.dto';
import { Bono } from './entities/bono.entity';
import { BonosService } from './bonos.service';

@Controller('bonos')
@UseInterceptors(BusinessErrorsInterceptor)
export class BonosController {
    constructor(private readonly bonosService: BonosService) {}

  @Post()
  async create(@Body() createBonoDto: CreateBonoDto) {
    return await this.bonosService.crearBono(createBonoDto);
  }

  @Get('clase/:codigoClase')
  async findByClassCode(@Param('codigoClase') codigoClase: string) {
    return await this.bonosService.findBonoByCodigoDeLaClase(codigoClase);
  }

  @Get('usuario/:usuarioId')
  async findAllByUser(@Param('usuarioId') userId: number) {
    return await this.bonosService.findAllBonosByUsuario(userId);
  }

  @Get(':bonoId')
  async findOne(@Param('bonoId') bonoId: number) {
    return await this.bonosService.findById(bonoId);
  }

  @Delete(':bonoId')
  @HttpCode(204)
  async delete(@Param('bonoId') bonusId: number) {
    return await this.bonosService.deleteBono(bonusId);
  }
}
