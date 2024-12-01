import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';
import { BonosModule } from '../bonos/bonos.module';
import { ClasesModule } from '../clases/clases.module'; // Importación del módulo de clases

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    BonosModule, // Para las asociaciones de Bonos
    ClasesModule, // Para el repositorio Clase
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
