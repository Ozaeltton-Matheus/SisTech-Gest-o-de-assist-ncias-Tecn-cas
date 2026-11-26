import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrdemServico } from "./ordem_servico.entity";

@Entity('agendamento')
export class Agendamento {
    @PrimaryGeneratedColumn({ name: 'id_agendamento' })
    id_agendamento!: number;

    @ManyToOne(() => OrdemServico, ordemServico => ordemServico.agendamento, { nullable: false })
    @JoinColumn({  name: 'id_os'})
    ordensServico!: OrdemServico;

    @Column({ name: 'data_agendada', type: 'date'})
    data_agendada!: string;

    @Column({ name: 'horario', type: 'time' })
    horario!: string;

    @Column({ name: 'endereco_coleta', type: 'varchar', length: 255, nullable: true })
    endereco_coleta!: string;

    @Column({ name: 'status', type: 'varchar', length: 30,  default: "AGENDADO" })
    status!: string;

    @Column({ name: 'observacao', type: 'text', nullable: true })
    observacao!: string;

}