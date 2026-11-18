import { CriarAparelhoDTO } from './dto/criar-aparelho.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Aparelho } from './entities/aparelhos.entity';
import { Marca } from './entities/marca.entity';
import { Modelo } from './entities/modelo.entity';
import { Cliente } from 'src/usuarios/entities/cliente.entity';
import { Tipo_aparelho } from './entities/tipo_aparelho.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AparelhosService {
    constructor(
        @InjectRepository(Aparelho)
        private readonly aparelhoRepository: Repository<Aparelho>,

        @InjectRepository(Marca)
        private readonly marcaRepository: Repository<Marca>,

        @InjectRepository(Modelo)
        private readonly modeloRepository: Repository<Modelo>,

        @InjectRepository(Tipo_aparelho)
        private readonly tipoaprlRepository: Repository<Tipo_aparelho>
    ) {}

    listar() {
        return this.aparelhoRepository.find({ order: { id_aparelho: 'ASC' } });
    }

    async buscarPorId(id_aparelho: number) {
        const aparelho = await this.aparelhoRepository.findOneBy({ id_aparelho })

        if (!aparelho) {
            throw new NotFoundException('Apaprelho não encontrado');
        }
        return aparelho;
    }

    criarAparelho(dto: CriarAparelhoDTO) {
        return this.aparelhoRepository.manager.transaction(async (manager) =>{

            const cliente = await manager.findOneBy(Cliente, {
                id: dto.id_cliente
            });

            const tipo = await manager.findOneBy(Tipo_aparelho, {
                id_tipo: dto.id_tipo
            });

            const marca = await manager.findOneBy(Marca, {
                id_marca: dto.id_marca
            });

            const modelo = await manager.findOneBy(Modelo, {
                id_modelo: dto.id_modelo
            });

            if (!cliente || !tipo || !marca || !modelo) {
                throw new NotFoundException('Não há registros registros relacionados encontrados');
            }

            const aparelho = manager.create(Aparelho, {
                nome: dto.nome,
                cliente: cliente,
                tipo_aparelhos: tipo,
                marcas: marca,
                modelos: modelo,
                descricao: dto.descricao

            });
            return manager.save(Aparelho, aparelho)

        });

    }
}
