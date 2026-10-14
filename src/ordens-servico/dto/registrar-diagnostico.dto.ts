
import { IsString, MinLength } from 'class-validator';

export class RegistrarDiagnosticoDto {
  @IsString()
  @MinLength(5)
  diagnostico: string;
}
