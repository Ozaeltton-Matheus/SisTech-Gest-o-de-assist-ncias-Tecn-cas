import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdensServicoService } from './ordens-servico/ordens-servico.service';
import { OrdensServicoController } from './ordens-servico/ordens-servico.controller';
import { OrdensServicoModule } from './ordens-servico/ordens-servico.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgrespassword',
      database: process.env.DB_NAME || 'assistos_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    OrdensServicoModule,
  ],
  controllers: [AppController, OrdensServicoController],
  providers: [AppService, OrdensServicoService],
})
export class AppModule {}