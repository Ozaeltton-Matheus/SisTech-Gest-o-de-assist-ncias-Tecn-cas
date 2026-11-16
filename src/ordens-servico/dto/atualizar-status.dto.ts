import { IsEnum } from 'class-validator';
import { StatusOS } from '../entities/status-os.enum';

export class AtualizarStatusDto {
  @IsEnum(StatusOS)
  status: StatusOS;
}
