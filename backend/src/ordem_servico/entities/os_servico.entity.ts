import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrdemServico } from "./ordem_servico.entity";
import { Servico } from "./servico.entity";

@Entity('os_servico')
export class OS_Servico {
    @PrimaryGeneratedColumn({name: 'id_os'})
    id_os!: number;

    @ManyToOne(() => OrdemServico, ordemservico => ordemservico.os_Servico)
    @JoinColumn({ name: 'id_os' })
    ordens_servico!: OrdemServico;

    @ManyToOne(() => Servico, servico => servico.osServico)
    @JoinColumn({ name: 'id_servico' })
    servicos!: Servico;

    @Column({ name: 'quantidade', type: 'int' })
    quantidade!: number;

    @Column({ name: 'preco_aplicado', type: 'decimal' })
    preco_aplicado!: number;
}