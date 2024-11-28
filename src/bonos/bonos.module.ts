import { Module } from '@nestjs/common';
import { BonosService } from './bonos.service';
import { BonosController } from './bonos.controller';

@Module({
  controllers: [BonosController],
  providers: [BonosService],
})
export class BonosModule {}
