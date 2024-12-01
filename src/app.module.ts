import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ClasesModule } from './clases/clases.module';
import { BonosModule } from './bonos/bonos.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2',
      autoLoadEntities: true,
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    UsuariosModule,
    ClasesModule,
    BonosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
