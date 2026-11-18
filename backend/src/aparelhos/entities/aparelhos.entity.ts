import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "src/usuarios/entities/cliente.entity";
import { Tipo_aparelho } from "./tipo_aparelho.entity";
import { Marca } from "./marca.entity";
import { Modelo } from "./modelo.entity";

@Entity('aparelho')
export class Aparelho {
    @PrimaryGeneratedColumn({ name: 'id_aparelho' })
    id_aparelho!: number;

    @ManyToOne(() => Cliente, cliente => cliente.aparelhos)
    @JoinColumn({ name: 'id_cliente' })
    cliente!: Cliente;

    @ManyToOne(() => Tipo_aparelho, tipo_aparelho => tipo_aparelho.aparelhos)
    @JoinColumn({ name: 'id_tipo' })
    tipo_aparelhos!: Tipo_aparelho;

    @ManyToOne(() => Marca, marca => marca.aparelhos)
    @JoinColumn({ name: 'id_marca' })
    marcas!: Marca;

    @ManyToOne(() => Modelo, modelo => modelo.aparelhos)
    @JoinColumn({ name: 'id_modelo' })
    modelos!: Modelo;

    @Column({ name: 'descricao', type: 'text' })
    descricao!: string;

    @Column({ name: 'data_cadastro', type: 'timestamptz' })
    data_cadastro!: Date;
}