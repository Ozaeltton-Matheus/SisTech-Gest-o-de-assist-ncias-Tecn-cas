import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('usuario')
export class Usuario{
    @PrimaryGeneratedColumn({name: 'id_usuario'})
    id: number;

    @Column({ length: 150, unique: true })
    email: string;

    @Column({ length: 255 })
    senha: string;

    @Column({ name: 'tipo_usuario'})
    tipo_usuario: string;
    
    @Column({ default: true})
    ativo: boolean;
}   