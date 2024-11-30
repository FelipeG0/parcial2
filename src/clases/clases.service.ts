import { Injectable } from '@nestjs/common';
import { CreateClaseDto } from './dto/create-clase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clase } from './entities/clase.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
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

  async findById(id: number): Promise<Clase> {
    const clase: Clase = await this.claseRepository.findOne({where: {id},relations : ["bonos", "usuario"]} );
       if (!clase)
         throw new BusinessLogicException("The class with the given id was not found", BusinessError.NOT_FOUND);
  
       return clase;
  }
}
