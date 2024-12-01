import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonosController } from './bonos.controller';
import { BonosService } from './bonos.service';
import { Bono } from './entities/bono.entity';
import { Clase } from '../clases/entities/clase.entity';
import { ClasesModule } from '../clases/clases.module'; // Importación del módulo de clases

@Module({
  imports: [
    TypeOrmModule.forFeature([Bono, Clase]), // Registro de repositorios
    ClasesModule, // Para el repositorio Clase
  ],
  controllers: [BonosController],
  providers: [BonosService],
  exports: [BonosService],
})
export class BonosModule {}
