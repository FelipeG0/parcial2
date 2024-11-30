import { TypeOrmModule } from '@nestjs/typeorm';
import { Bono } from '../../bonos/entities/bono.entity';
import { Clase } from '../../clases/entities/clase.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';


export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [Bono, Clase, Usuario],
    synchronize: true,
    keepConnectionAlive: true 
  }),
  TypeOrmModule.forFeature([Bono, Clase, Usuario]),
];