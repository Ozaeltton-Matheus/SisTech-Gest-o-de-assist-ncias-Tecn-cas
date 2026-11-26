import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrdemServico } from "./ordem_servico.entity";
import { Funcionario } from "src/usuarios/entities/funcionario.entity";

@Entity('diagnostico')
export class Diagnostico {
    @PrimaryGeneratedColumn({ name: 'id_diagnostico' })
    id_diagnostico!: number;

    @ManyToOne(() => OrdemServico, ordemServico => ordemServico.diagnosticos, { nullable: false })
    @JoinColumn({ name: 'id_os'})
    ordensServico!: OrdemServico;

    @ManyToOne(() => Funcionario, funcionario => funcionario.diagnosticos, { nullable: false })
    @JoinColumn({ name: 'id_funcionario' })
    funcionarios!: Funcionario;

    @Column({ name: 'descricao', type: 'text' })
    descricao!: string;

    @Column({ name: 'observacoes', type: 'text', nullable: true })
    observacoes!: string;

    @Column({ name: 'data_diagnostico', type: 'date', default: () => 'CURRENT_DATE' })
    data_diagnostico!: string;
}