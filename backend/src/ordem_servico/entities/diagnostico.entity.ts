import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrdemServico } from "./ordem_servico.entity";
import { Funcionario } from "src/usuarios/entities/funcionario.entity";

@Entity('diagnostico')
export class Diagnostico {
    @PrimaryGeneratedColumn({ name: 'id_diagnostico' })
    id_diagnostico!: number;

    @ManyToOne(() => OrdemServico, ordemServico => ordemServico.diagnosticos)
    @JoinColumn({ name: 'id_os '})
    ordensServico!: OrdemServico;

    @ManyToOne(() => Funcionario, funcionario => funcionario.diagnosticos)
    @JoinColumn({ name: 'id_funcionario' })
    funcionarios!: Funcionario;
}