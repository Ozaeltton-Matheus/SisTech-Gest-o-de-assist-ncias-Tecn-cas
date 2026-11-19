import { Test, TestingModule } from '@nestjs/testing';
import { AparelhosService } from './aparelhos.service';

describe('AparelhosService', () => {
  let service: AparelhosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AparelhosService],
    }).compile();

    service = module.get<AparelhosService>(AparelhosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
