import { Column, OneToMany, Entity, PrimaryGeneratedColumn } from "typeorm";
import { OS_Servico } from "./os_servico.entity";

@Entity('servico')
export class Servico {
    @PrimaryGeneratedColumn({ name: 'id_servico' })
    id_servico!: number;

    @Column({ name: 'nome', type: 'varchar', length: 150 })
    nome!: string;

    @Column({ name: 'descricao', type: 'text' })
    descricao!: string;

    @Column({ name: 'preco', type: 'decimal', precision: 10, scale: 2, default: 0.00 })
    preco!: number;

    @Column({ name: 'ativo', type: 'boolean', default: true })
    ativo!: boolean;

    @OneToMany(() => OS_Servico, osServico => osServico.servicos)
    osServico!: OS_Servico[];
}