import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { BusinessError, BusinessLogicException } from 'src/shared/BusinessLogicException';
import { isEmpty } from 'class-validator';

@Injectable()
export class UsuariosService {

  constructor(

      @InjectRepository(Usuario)
      private readonly usuarioRepository : Repository<Usuario>

  ){}
  async create(usuario: Usuario) : Promise<Usuario> {
    if (usuario.rol === "Profesor") {
      if (!["TICSW", "IMAGINE", "COMIT"].includes(usuario.grupoInvestigacion)) {
        throw new Error('Grupo de investigación inválido para profesores');
      }
    } else if (usuario.rol === "Decana") {
      if (!/^\d{8}$/.test(String(usuario.nExtension))) {
        throw new Error("La extensión debe tener 8 dígitos");
      }
    }
    return this.usuarioRepository.save(usuario);
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario: Usuario = await this.usuarioRepository.findOne({where: {id},relations : ["truequesComoUsuario1", "truequesComoUsuario2", "resenas", "certificaciones"]} );
       if (!usuario)
         throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
  
       return usuario;
  }

  async remove(id: number) {
    const usuario = await this.findOne(id);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    if (usuario.rol === "Decana" || usuario.bonos) {
      throw new Error('No se puede eliminar un usuario Decana o con bonos');
    }

    return this.usuarioRepository.delete(id);
  }
}
