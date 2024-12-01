import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CreateClaseDto } from './dto/create-clase.dto';
import { Clase } from './entities/clase.entity';
import { ClasesService } from './clases.service';

@Controller('clases')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClasesController {
    constructor(private readonly clasesService: ClasesService) {}

  @Get(':claseId')
  async findOne(@Param('claseId') classId: number) {
    return await this.clasesService.findById(classId);
  }

  @Post()
  async create(@Body() createClaseDto: CreateClaseDto) {
    const clase: Clase = plainToInstance(Clase, createClaseDto);
    return await this.clasesService.create(clase);
  }
}
