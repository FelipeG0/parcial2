import { Injectable } from '@nestjs/common';
import { CreateBonoDto } from './dto/create-bono.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bono } from './entities/bono.entity';
import { Repository } from 'typeorm';
import { Clase } from '../clases/entities/clase.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class BonosService {

  constructor(

    @InjectRepository(Bono)
    private readonly bonoRepository : Repository<Bono>,

    @InjectRepository(Clase)
    private claseRepository: Repository<Clase>,

  ){}
  async create(bonoDto: CreateBonoDto) {
    const bono = this.bonoRepository.create(bonoDto)
    return await this.bonoRepository.save(bono);
  
  }

  async findBonoByCodigoDeLaClase(codigo: string) {
    const clase = await this.claseRepository.findOneBy({ codigo });
    if (!clase) {
      throw new BusinessLogicException("clase no encontrado.", BusinessError.NOT_FOUND);
    }

    return this.bonoRepository.findOne({ where: { clase },});
  }

  async findAllBonosByUsuario(usuarioId: number) {
    return this.bonoRepository.find({ where: { usuario: { id: usuarioId } } });
  }

  async deleteBono(id: number) {
    const bono = await this.bonoRepository.findOneBy({ id });
    if (!bono) {
      throw new BusinessLogicException("Bono no encontrado.", BusinessError.NOT_FOUND);
    }

    if (bono.calificacion > 4) {
      throw new BusinessLogicException("No se puede eliminar un bono con calificación mayor a 4.", BusinessError.PRECONDITION_FAILED);
    }

    return this.bonoRepository.delete(id);
  }
}
