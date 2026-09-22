import { Test, TestingModule } from '@nestjs/testing';
import { AnimeService } from './anime.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AnimeService', () => {
  let service: AnimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimeService,
        {
          provide: PrismaService,
          useValue: {
            anime: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AnimeService>(AnimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
