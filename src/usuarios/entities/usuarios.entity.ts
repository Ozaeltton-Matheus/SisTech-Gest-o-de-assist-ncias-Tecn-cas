import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('usuario')
export class Usuario{
    @PrimaryGeneratedColumn({name: 'id_usuario'})
    id?: number;

    @Column({name: 'nome', length: 30})
    nome!: string;

    @Column({ length: 150, unique: true })
    email!: string;

    @Column({name: 'senha', length: 255 })
    senha!: string;

    @Column({ name: 'tipo_usuario', length: 50})
    tipo_usuario!: string;
    
    @Column({ default: true})
    ativo?: boolean;
}   