import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuarios.entity';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepositorio: Repository<Usuario>,
    ) {}

    async buscarPorEmail(email:string): Promise<Usuario | null > {
        return await this.usuarioRepositorio.findOne({
            where: {email},
        });
    }

}

