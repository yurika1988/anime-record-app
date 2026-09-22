import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';

@Injectable()
export class AnimeService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAnimeDto: CreateAnimeDto) {
    return this.prisma.anime.create({
      data: createAnimeDto,
    });
  }

  findAll() {
    return this.prisma.anime.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const anime = await this.prisma.anime.findUnique({ where: { id } });
    if (!anime) {
      throw new NotFoundException(`Anime with id ${id} not found`);
    }
    return anime;
  }

  async update(id: string, updateAnimeDto: UpdateAnimeDto) {
    try {
      return await this.prisma.anime.update({
        where: { id },
        data: updateAnimeDto,
      });
    } catch (error) {
      this.handleNotFound(id, error);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.anime.delete({ where: { id } });
    } catch (error) {
      this.handleNotFound(id, error);
    }
  }

  private handleNotFound(id: string, error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new NotFoundException(`Anime with id ${id} not found`);
    }
    throw error;
  }
}
