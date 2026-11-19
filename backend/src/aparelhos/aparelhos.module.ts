import { Module } from '@nestjs/common';
import { AparelhosController } from './aparelhos.controller';
import { AparelhosService } from './aparelhos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aparelho } from './entities/aparelhos.entity';
import { Marca } from './entities/marca.entity';
import { Modelo } from './entities/modelo.entity';
import { Tipo_aparelho } from './entities/tipo_aparelho.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aparelho, Marca, Modelo, Tipo_aparelho])],
  controllers: [AparelhosController],
  providers: [AparelhosService]
})
export class AparelhosModule {}
