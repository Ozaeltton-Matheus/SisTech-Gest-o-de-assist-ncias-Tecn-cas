import { Column, Entity, JoinColumn, OneToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Marca } from "./marca.entity";
import { Tipo_aparelho } from "./tipo_aparelho.entity";
import { Aparelho } from "./aparelhos.entity";

@Entity('modelo')
export class Modelo {
    @PrimaryGeneratedColumn({ name: 'id_modelo'})
    id_modelo!: number;

    @ManyToOne(() => Marca, marca => marca.modelos)
    @JoinColumn({ name: 'id_marca' })
    marcas!: Marca;

    @ManyToOne(() => Tipo_aparelho, tipo_aparelho => tipo_aparelho.modelos)
    @JoinColumn({ name: 'id_tipo' })
    tipo_aparelho!: Tipo_aparelho;

    @OneToMany(() => Aparelho, aparelho => aparelho.modelos)
    aparelhos!: Aparelho[];

    

    @Column({ name: 'nome', length: 100 })
    nome!: string;
}