import { Test, TestingModule } from '@nestjs/testing';
import { OrdensServicoController } from './ordens-servico.controller';
import { OrdensServicoService } from './ordens-servico.service';

describe('OrdensServicoController', () => {
  let controller: OrdensServicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdensServicoController],
      providers: [
        {
          provide: OrdensServicoService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<OrdensServicoController>(OrdensServicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
