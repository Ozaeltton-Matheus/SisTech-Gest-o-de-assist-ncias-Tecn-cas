import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrdemServico } from "./ordem_servico.entity";
import { Funcionario } from "src/usuarios/entities/funcionario.entity";

@Entity('historico_status_os')
export class HistoricoStatusOS {
    @PrimaryGeneratedColumn({ name: 'id_historico' })
    id_historico!: number;

    @ManyToOne(() => OrdemServico, ordemservico => ordemservico.historicostatus, { nullable: false })
    @JoinColumn({ name: 'id_os' })
    ordens_servico!: OrdemServico;

    @ManyToOne(() => Funcionario, funcionario => funcionario.historico_status_os)
    @JoinColumn({ name: 'id_funcionario' })
    funcionarios!: Funcionario;

    @Column({ name: 'status', type: 'varchar', length: 30 })
    status!: string;

    @Column({ name: 'observacao', type: 'text' })
    observacao!: string;

    @Column({ name: 'data_hora', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    data_hora!: Date;
}