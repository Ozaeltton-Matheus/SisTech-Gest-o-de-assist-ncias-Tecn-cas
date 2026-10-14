
import { IsNumber, Min, IsOptional } from 'class-validator';

export class GerarOrcamentoDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorMaoDeObra: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorPecas: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorDesconto?: number;
}
