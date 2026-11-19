import { Test, TestingModule } from '@nestjs/testing';
import { AparelhosController } from './aparelhos.controller';

describe('AparelhosController', () => {
  let controller: AparelhosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AparelhosController],
    }).compile();

    controller = module.get<AparelhosController>(AparelhosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
