import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Modelo } from "./modelo.entity";
import { Aparelho } from "./aparelhos.entity";

@Entity("tipo_aparelho")
export class Tipo_aparelho {
    @PrimaryGeneratedColumn({ name: 'id_tipo' })
    id_tipo!: number;

    @Column({ name: 'nome', length: 100 })
    nome!: string;

    @Column({ name: 'descricao', length: 255 })
    descricao!: string;

    @OneToMany(() => Modelo, modelo => modelo.tipo_aparelho)
    modelos!: Modelo[];

    @OneToMany(() => Aparelho, aparelho => aparelho.tipo_aparelhos)
    aparelhos!: Aparelho[];

}