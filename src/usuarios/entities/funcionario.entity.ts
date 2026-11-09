import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn
} from 'typeorm';
import { Usuario } from './usuarios.entity';

@Entity('funcionario')
export class Funcionario {
  @PrimaryGeneratedColumn({ name: 'id_funcionario' })
  id_funcionario!: number;

  @ManyToOne(() => Usuario, usuario => usuario.funcionarios)
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @Column({ type: 'varchar', length: 150 })
  nome!: string;

  @Column({ type: 'varchar', length: 14, unique: true })
  cpf!: string;

  @Column({ type: 'varchar', length: 20 })
  telefone!: string;

  @Column({ type: 'varchar', length: 100 })
  cargo!: string;

  @CreateDateColumn({ name: 'data_cadastro', type: 'timestamptz' })
  data_cadastro!: Date;

  @Column({ type: 'boolean', default: true })
  ativo!: boolean;
}

