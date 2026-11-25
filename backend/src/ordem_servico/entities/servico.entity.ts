import { Column, OneToMany, Entity, PrimaryGeneratedColumn } from "typeorm";
import { OS_Servico } from "./os_servico.entity";

@Entity('servico')
export class Servico {
    @PrimaryGeneratedColumn({ name: 'id_servico' })
    id_servico!: number;

    @Column({ name: 'nome', length: 150 })
    nome!: string;

    @Column({ name: 'descricao', type: 'text' })
    descricao!: string;

    @Column({ name: 'preco_aplicado', type: 'decimal' })
    preco_aplicado!: number;

    @Column({ name: 'ativo', type: 'boolean' })
    ativo!: boolean;

    @OneToMany(() => OS_Servico, osServico => osServico.servicos)
    osServico!: OS_Servico[];
}