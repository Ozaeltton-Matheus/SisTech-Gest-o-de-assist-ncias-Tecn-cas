import { Body, Controller, Get, Post } from '@nestjs/common';
import { AparelhosService } from './aparelhos.service';
import { CriarAparelhoDTO } from './dto/criar-aparelho.dto';

@Controller('aparelhos')
export class AparelhosController {
    constructor ( private readonly service: AparelhosService ) {}

    @Get()
    listar() {
        return this.service.listar();
    }

    @Post()
    criarAparelho(@Body() criarAparelhoDTO: CriarAparelhoDTO) {
        return this.service.criarAparelho(criarAparelhoDTO);
    }

}
