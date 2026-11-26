import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { OrdemServico } from "./ordem_servico.entity";
import { Servico } from "./servico.entity";

@Entity('os_servico')
export class OS_Servico {
    @PrimaryColumn({name: 'id_os', type: 'integer'})
    id_os!: number;

    @PrimaryColumn({ name: 'id_servico', type: 'integer' })
    id_servico!: number;

    @ManyToOne(() => Servico, servico => servico.osServico, { nullable: false })
    @JoinColumn({ name: 'id_servico' })
    servicos!: Servico;

    @ManyToOne(() => OrdemServico, ordemservico => ordemservico.os_Servico, { nullable: false })
    @JoinColumn({ name: 'id_os' })
    ordens_servico!: OrdemServico;


    @Column({ name: 'quantidade', type: 'integer', default: 1 })
    quantidade!: number;

    @Column({ name: 'preco_aplicado', type: 'decimal', precision: 10, scale: 2 })
    preco_aplicado!: number;
}