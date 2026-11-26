import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrdemServico } from "./ordem_servico.entity";

@Entity('pagamento')
export class Pagamento {
    @PrimaryGeneratedColumn({ name: 'id_pagamento' })
    id_pagamento!: number;

    @ManyToOne(()=> OrdemServico, ordemServico => ordemServico.pagamentos, { nullable: false })
    @JoinColumn({ name: 'id_os' })
    ordensServico!: OrdemServico;

    @Column({ name: 'valor', type: 'decimal', precision: 10, scale: 2 })
    valor!: number;

    @Column({ name: 'data_pagamento', type: 'date', nullable: true })
    data_pagamento!: string;

    @Column({ name: 'forma_pagamento', type: 'varchar', length: 30 })
    forma_pagamento!: string;

    @Column({ name: 'status', type: 'varchar', length: 30, default: "PENDENTE" })
    status!: string;
}