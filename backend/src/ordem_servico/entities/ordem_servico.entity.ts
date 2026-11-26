import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "src/usuarios/entities/cliente.entity";
import { Aparelho } from "src/aparelhos/entities/aparelhos.entity";
import { Funcionario } from "src/usuarios/entities/funcionario.entity";
import { HistoricoStatusOS } from "./historico_status_os.entity";
import { OS_Servico } from "./os_servico.entity";
import { Agendamento } from "./agendamento.entity";
import { Pagamento } from "./pagamento.entity";
import { AcaoReparo } from "./acao_reparo.entity";
import { Diagnostico } from "./diagnostico.entity";
import { Orcamento } from "./orcamento.entity";

@Entity('ordem_servico')
export class OrdemServico {
    @PrimaryGeneratedColumn({ name: 'id_os' })
    id_os!: number;

    @ManyToOne(() => Cliente, cliente => cliente.ordens_servico)
    @JoinColumn({ name: 'id_cliente' })
    clientes!: Cliente;

    @ManyToOne(() => Aparelho, aparelho => aparelho.ordens_servico )
    @JoinColumn({ name: 'id_aparelho' })
    aparelhos!: Aparelho;

    @ManyToOne(() => Funcionario, funcionario => funcionario.ordens_servico)
    @JoinColumn({ name: 'id_funcionario' })
    funcionarios!: Funcionario;

    @Column({ name: 'data_abertura', type: 'date', default: () => "CURRENT_DATE" })
    data_abertura!: string;

    @Column({ name: 'defeito_relatado', type: 'text'})
    defeito_relatado!: string;

    @Column({ name: 'observacoes', type: 'text', nullable: true })
    observacoes!: string;

    @Column({ name: 'status_atual', type: 'varchar', length: 30, default: 'RECEBIDO' })
    status_atual!: string;

    @Column({ name: 'data_finalizacao', type: 'date', nullable: true })
    data_finalizacao!: string;

    @Column({ name: "valor_total", type: "decimal", precision: 10, scale: 2, default: 0.00 })
    valor_total!: number;

    @OneToMany(() => HistoricoStatusOS, historicoStatusOS => historicoStatusOS.ordens_servico)
    historicostatus!: HistoricoStatusOS[];

    @OneToMany(() => OS_Servico, osServico => osServico.ordens_servico)
    os_Servico!: OS_Servico[];

    @OneToMany(() => Agendamento, agendamento => agendamento.ordensServico)
    agendamento!: Agendamento[];

    @OneToMany(() => Pagamento, pagamento => pagamento.ordensServico)
    pagamentos!: Pagamento[];

    @OneToMany(() => AcaoReparo, acaoReparo => acaoReparo.ordensServico)
    acoes_reparo!: AcaoReparo[];

    @OneToMany(() => Diagnostico, diagnostico => diagnostico.ordensServico)
    diagnosticos!: Diagnostico[];

    @OneToMany(() => Orcamento, orcamento => orcamento.ordens_servico)
    orcamentos!: Orcamento[];

}