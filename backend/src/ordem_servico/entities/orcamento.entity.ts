import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrdemServico } from "./ordem_servico.entity";

@Entity('orcamento')
export class Orcamento {
    @PrimaryGeneratedColumn({name: 'id_orcamento'})
    id_orcamento!: number;

    @ManyToOne(() => OrdemServico, ordemServico => ordemServico.orcamentos)
    @JoinColumn({ name: 'id_os' })
    ordens_servico!: OrdemServico;

    @Column({ name: 'valor_mao_obra', type: 'decimal' })
    valorMaoObra!: number;

    @Column({ name: 'valor_pecas', type: 'decimal' })
    valorPecas!: number;

    @Column({ name: 'valor_total', type: 'decimal' })
    valorTotal!: number;


}