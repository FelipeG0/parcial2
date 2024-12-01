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

        if (claseDto.codigo.length !== 10) {
            throw new BusinessLogicException('El código de la clase debe tener 10 caracteres', BusinessError.PRECONDITION_FAILED);
        }

        const clase = this.claseRepository.create(claseDto);
        return this.claseRepository.save(clase);
  }

  async findById(id: number): Promise<Clase> {
    const clase: Clase = await this.claseRepository.findOne({where: {id},relations : ["bonos", "usuario"]} );
       if (!clase)
         throw new BusinessLogicException("The class with the given id was not found", BusinessError.NOT_FOUND);
  
       return clase;
  }
}
