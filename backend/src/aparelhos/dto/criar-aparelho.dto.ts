import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CriarAparelhoDTO {

    @IsString()
    @IsNotEmpty()
    nome!: string;

    @IsNotEmpty()
    @IsInt()
    id_cliente!: number;

    @IsInt()
    @IsNotEmpty()
    id_tipo!: number;

    @IsInt()
    @IsNotEmpty()
    id_marca!: number;

    @IsInt()
    @IsNotEmpty()
    id_modelo!: number;

    @IsString()
    @IsNotEmpty()
    descricao!: string
}