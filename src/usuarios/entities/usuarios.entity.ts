import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Cliente } from "./cliente.entity";
import { Funcionario } from "./funcionario.entity";

@Entity('usuario')
export class Usuario{
    @PrimaryGeneratedColumn({name: 'id_usuario'})
    id?: number;

    @Column({ length: 150, unique: true })
    email!: string;

    @Column({name: 'senha', length: 255 })
    senha!: string;

    @Column({ name: 'tipo_usuario', length: 50})
    tipo_usuario!: string;

    @Column({ default: true})
    ativo?: boolean;

    @OneToMany(() => Cliente, cliente => cliente.usuario)
    clientes!: Cliente[];

    @OneToMany(() => Funcionario, funcionario => funcionario.usuario)
    funcionarios!: Funcionario[];
}   