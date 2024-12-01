import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClasesController } from './clases.controller';
import { ClasesService } from './clases.service';
import { Clase } from './entities/clase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clase])], // Registro del repositorio Clase
  controllers: [ClasesController],
  providers: [ClasesService],
  exports: [ClasesService, TypeOrmModule], // Exporta el módulo para uso en otros módulos
})
export class ClasesModule {}
