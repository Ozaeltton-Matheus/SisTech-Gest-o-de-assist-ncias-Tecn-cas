import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrdemServico } from "./ordem_servico.entity";
import { Funcionario } from "src/usuarios/entities/funcionario.entity";

@Entity('acao_reparo')
export class AcaoReparo {
    @PrimaryGeneratedColumn({ name: 'id_acao' })
    id_acao!: number;

    @ManyToOne(() => OrdemServico, ordemServico => ordemServico.acoes_reparo)
    @JoinColumn({ name: 'id_os' })
    ordensServico!: OrdemServico;

    @ManyToOne(() => Funcionario, funcionario => funcionario.acoes_reparo)
    @JoinColumn({ name: 'id_funcionario' })
    funcionarios!: Funcionario;
}