import { Injectable } from '@nestjs/common';
import { CreateBonoDto } from './dto/create-bono.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bono } from './entities/bono.entity';
import { Repository } from 'typeorm';
import { Clase } from '../clases/entities/clase.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class BonosService {

  constructor(

    @InjectRepository(Bono)
    private readonly bonoRepository : Repository<Bono>,

    @InjectRepository(Clase)
    private claseRepository: Repository<Clase>,

    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,

  ){}


  async crearBono(bonoDto: CreateBonoDto): Promise<Bono> {
    const { monto, usuarioId, codigoClase } = bonoDto;

    if (!monto || monto <= 0) {
        throw new BusinessLogicException('El monto debe ser un valor positivo', BusinessError.PRECONDITION_FAILED);
    }

    const usuario = await this.usuarioRepository.findOne({ where: { id: usuarioId } });
    if (!usuario || usuario.rol !== 'Profesor') {
        throw new BusinessLogicException('El usuario debe ser un Profesor', BusinessError.PRECONDITION_FAILED);
    }

    const clase = await this.claseRepository.findOne({ where: { codigo : codigoClase } });
    if (!clase) {
        throw new BusinessLogicException ('Clase con ese código no encontrada', BusinessError.NOT_FOUND);
    }

    const bono = this.bonoRepository.create(bonoDto);
    bono.usuario = usuario;
    bono.clase = clase;

    return this.bonoRepository.save(bono);
  }

  async findById(id: number): Promise<Bono> {
    const bono: Bono = await this.bonoRepository.findOne({where: {id}, relations:["usuario", "clase"]} );
       if (!bono)
         throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
  
       return bono;
  }

  async findBonoByCodigoDeLaClase(codigo: string) {
    const clase = await this.claseRepository.findOne({ where : {codigo} });
    if (!clase) {
      throw new BusinessLogicException("clase no encontrada.", BusinessError.NOT_FOUND);
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
