import { IsNotEmpty, IsString } from 'class-validator';

export class RegistrarAcaoDto {
  @IsString()
  @IsNotEmpty()
  descricao: string;
}
