import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn, ManyToOne } from "typeorm";
import { Usuario } from "./usuarios.entity";

@Entity('cliente')
export class Cliente {
    @PrimaryGeneratedColumn({name: 'id_cliente'})
    id!: number;

    @ManyToOne(() => Usuario, usuario => usuario.clientes)
    @JoinColumn({ name: 'id_usuario' })
    usuario!: Usuario;

    @Column({ name: 'nome', length: 150 })
    nome!: string;

    @Column({ name: 'cpf', length: 14, unique: true })
    cpf!: string;

    @Column({ name: 'endereco', length: 255 })
    endereco!: string;

    @Column({ name: 'telefone', length: 20 })
    telefone!: string;

    @CreateDateColumn({ name: 'data_cadastro', type: 'timestamptz' })
    data_cadastro!: Date;
}