import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Modelo } from "./modelo.entity";
import { Aparelho } from "./aparelhos.entity";

@Entity("marca")
export class Marca {
    @PrimaryGeneratedColumn({ name: 'id_marca'})
    id_marca!: number;

    @Column({ name: 'nome', length: 100 })
    nome!: string;

    @OneToMany(() => Modelo, modelo => modelo.marcas)
    modelos!: Modelo[];

    @OneToMany(() => Aparelho, aparelho => aparelho.marcas)
    aparelhos!: Aparelho[];
    
}