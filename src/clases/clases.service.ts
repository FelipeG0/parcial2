import { Injectable } from '@nestjs/common';
import { CreateClaseDto } from './dto/create-clase.dto';
import { UpdateClaseDto } from './dto/update-clase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clase } from './entities/clase.entity';

@Injectable()
export class ClasesService {


  constructor(

    @InjectRepository(Clase)
    private readonly claseRepository : Repository<Clase>

  ){}
  async create(claseDto: CreateClaseDto) {
    const clase = this.claseRepository.create(claseDto)
    return await this.claseRepository.save(clase);
  }

  findAll() {
    return `This action returns all clases`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clase`;
  }

  update(id: number, updateClaseDto: UpdateClaseDto) {
    return `This action updates a #${id} clase`;
  }

  remove(id: number) {
    return `This action removes a #${id} clase`;
  }
}
