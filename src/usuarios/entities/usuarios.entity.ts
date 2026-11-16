import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TipoUsuario } from '../../auth/tipo-usuario.enum';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id?: number;

  @Column({ length: 150, unique: true })
  email!: string;

  @Column({
    name: 'senha',
    length: 255,
    select: false,
  })
  senha!: string;

  @Column({ name: 'tipo_usuario', type: 'varchar', length: 50 })
  tipo_usuario!: TipoUsuario;

  @Column({ default: true })
  ativo?: boolean;
}
