import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { Usuario } from './usuarios.entity';
import { OrdemServico } from 'src/ordem_servico/entities/ordem_servico.entity';
import { HistoricoStatusOS } from 'src/ordem_servico/entities/historico_status_os.entity';
import { AcaoReparo } from 'src/ordem_servico/entities/acao_reparo.entity';
import { Diagnostico } from 'src/ordem_servico/entities/diagnostico.entity';

@Entity('funcionario')
export class Funcionario {
  @PrimaryGeneratedColumn({ name: 'id_funcionario' })
  id_funcionario!: number;

  @OneToOne(() => Usuario, usuario => usuario.funcionarios)
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @Column({ name: 'nome', type: 'varchar', length: 150 })
  nome!: string;

  @Column({ name:'cpf', type: 'varchar', length: 14, unique: true })
  cpf!: string;

  @Column({ name: 'telefone', type: 'varchar', length: 20 })
  telefone!: string;

  @Column({ name: 'cargo', type: 'varchar', length: 100 })
  cargo!: string;

  @CreateDateColumn({ name: 'data_cadastro', type: 'timestamptz' })
  data_cadastro!: Date;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo!: boolean;

  @OneToMany(() => OrdemServico, ordem_servico => ordem_servico.funcionarios)
  ordens_servico!: OrdemServico[];

  @OneToMany(() => HistoricoStatusOS, historico_status_os => historico_status_os.funcionarios)
  historico_status_os!: HistoricoStatusOS[];

  @OneToMany(() => AcaoReparo, acaoReparo => acaoReparo.funcionarios)
  acoes_reparo!: AcaoReparo[];

  @OneToMany(() => Diagnostico, diagnostico => diagnostico.funcionarios)
  diagnosticos!: Diagnostico;
}

