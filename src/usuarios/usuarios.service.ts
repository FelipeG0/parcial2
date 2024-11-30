import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { BonosService } from '../bonos/bonos.service';


@Injectable()
export class UsuariosService {

  constructor(

      @InjectRepository(Usuario)
      private readonly usuarioRepository : Repository<Usuario>,

      private readonly bonosService: BonosService,

  ){}
  async create(usuario: Usuario) : Promise<Usuario> {
    if (usuario.rol === "Profesor") {
      if (!["TICSW", "IMAGINE", "COMIT"].includes(usuario.grupoInvestigacion)) {
        throw new Error('Grupo de investigación inválido para profesores');
      }
    } else if (usuario.rol === 'Decana') {
      if (!usuario.nExtension || usuario.nExtension.toString().length !== 8) {
        throw new Error('El numero debe tener 8 digitos');
      }
    }
    return this.usuarioRepository.save(usuario);
  }

  async findById(id: number): Promise<Usuario> {
    const usuario: Usuario = await this.usuarioRepository.findOne({where: {id},relations : ["bonos", "clases"]} );
       if (!usuario)
         throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
  
       return usuario;
  }

  async remove(id: number) {
    const usuario = await this.findById(id);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    const bonos = this.bonosService.findAllBonosByUsuario(id)
    if (usuario.rol === "Decana" || (await bonos).length > 0) {
      throw new Error('No se puede eliminar un usuario Decana o con bonos');
    }
    return this.usuarioRepository.delete(id);
  }
}
