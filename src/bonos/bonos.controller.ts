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
    const bono: Bono = plainToInstance(Bono, createBonoDto);
    return await this.bonosService.create(bono);
  }

  @Get('clase/:claseId')
  async findByClassCode(@Param('claseId') claseId: number) {
    return await this.bonosService.findBonoByCodigoDeLaClase(claseId);
  }

  @Get('usuarios/:usuarioId')
  async findAllByUser(@Param('usuarioId') userId: number) {
    return await this.bonosService.findAllBonosByUsuario(userId);
  }

  @Get(':bonoId')
  async findOne(@Param('bonoId') bonoId: number) {
    return await this.bonosService.findById(bonoId);
  }

  @Delete(':bonoId')
  @HttpCode(204)
  async delete(@Param('bonoID') bonusId: number) {
    return await this.bonosService.deleteBono(bonusId);
  }
}
