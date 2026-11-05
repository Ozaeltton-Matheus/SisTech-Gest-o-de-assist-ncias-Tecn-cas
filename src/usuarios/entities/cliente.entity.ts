import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Usuario } from "./usuarios.entity";

@Entity('cliente')
export class Cliente {
    @PrimaryGeneratedColumn({name: 'id_cliente'})
    id!: number;

    @Column({ name: 'id_usuario', unique: true })
    id_usuario!: number;

    @OneToOne(() => Usuario)
    @JoinColumn({ name: 'id_usuario' })
    usuario!: Usuario;

    @Column({ name: 'nome', length: 150 })
    nome!: string;

    @Column({ name: 'cpf', length: 14, unique: true })
    cpf!: string;

    @Column({ name: 'endereco', length: 255 })
    endereco!: string;

    @CreateDateColumn({ name: 'data_cadastro', type: 'timestamptz' })
    data_cadastro!: Date;
}