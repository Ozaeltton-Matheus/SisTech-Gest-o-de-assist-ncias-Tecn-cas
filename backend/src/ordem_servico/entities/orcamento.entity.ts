import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrdemServico } from "./ordem_servico.entity";

@Entity('orcamento')
export class Orcamento {
    @PrimaryGeneratedColumn({ name: 'id_orcamento' })
    id_orcamento!: number;

    @ManyToOne(() => OrdemServico, ordemServico => ordemServico.orcamentos, { nullable: false })
    @JoinColumn({ name: 'id_os' })
    ordens_servico!: OrdemServico;

    @Column({ name: 'valor_mao_obra', type: 'decimal', precision: 10, scale: 2, default: 0.00 })
    valorMaoObra!: number;

    @Column({ name: 'valor_pecas', type: 'decimal', precision: 10, scale: 2, default: 0.00 })
    valorPecas!: number;

    @Column({ name: 'valor_total', type: 'decimal', precision: 10, scale: 2, default: 0.00 })
    valorTotal!: number;

    @Column({ name: 'validade', type: 'date', nullable: true })
    validade!: string;

    @Column({ name: 'status', type: 'varchar', length: 30, default: 'PENDENTE' })
    status!: string;

    @Column({ name: 'data_criacao', type: 'date', default: () => 'CURRENT_DATE' })
    data_criacao!: string;


}