
import {
  IsString,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class CriarOrdemServicoDto {
  @IsString()
  @IsNotEmpty()
  cliente: string;

  @IsString()
  @IsNotEmpty()
  equipamento: string;

  @IsString()
  @MinLength(5)
  defeitoRelatado: string;
}
