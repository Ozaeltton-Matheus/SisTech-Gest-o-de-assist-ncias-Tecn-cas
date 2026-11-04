import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from './usuarios.entity';

@Entity('funcionario')
export class Funcionario {
  @PrimaryGeneratedColumn({ name: 'id_funcionario' })
  id_funcionario!: number;

  @Column({ name: 'id_usuario', type: 'int' })
  id_usuario!: number;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario?: Usuario;

  @Column({ type: 'varchar', length: 150 })
  nome!: string;

  @Column({ type: 'varchar', length: 14, unique: true })
  cpf!: string;

  @Column({ type: 'varchar', length: 20 })
  telefone!: string;

  @Column({ type: 'varchar', length: 100 })
  cargo!: string;

  @Column({ type: 'boolean', default: true })
  ativo!: boolean;
}

