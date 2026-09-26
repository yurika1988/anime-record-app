import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadsService } from '../uploads/uploads.service';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';

@Injectable()
export class AnimeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploads: UploadsService,
  ) {}

  async create(
    userId: string,
    createAnimeDto: CreateAnimeDto,
    file?: Express.Multer.File,
  ) {
    const imageUrl = file
      ? await this.uploads.save(userId, file)
      : createAnimeDto.imageUrl;

    return this.prisma.anime.create({
      data: {
        ...createAnimeDto,
        imageUrl,
        userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.anime.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const anime = await this.prisma.anime.findFirst({
      where: { id, userId },
    });
    if (!anime) {
      throw new NotFoundException(`Anime with id ${id} not found`);
    }
    return anime;
  }

  async update(
    id: string,
    userId: string,
    updateAnimeDto: UpdateAnimeDto,
    file?: Express.Multer.File,
  ) {
    const existing = await this.findOne(id, userId);
    const { removeImage, ...rest } = updateAnimeDto;

    if (file) {
      await this.uploads.removeIfOwned(existing.imageUrl, userId);
      rest.imageUrl = await this.uploads.save(userId, file);
    } else if (removeImage) {
      await this.uploads.removeIfOwned(existing.imageUrl, userId);
      rest.imageUrl = null;
    } else if (
      rest.imageUrl !== undefined &&
      rest.imageUrl !== existing.imageUrl
    ) {
      await this.uploads.removeIfOwned(existing.imageUrl, userId);
    }

    return this.prisma.anime.update({
      where: { id },
      data: rest,
    });
  }

  async remove(id: string, userId: string) {
    const existing = await this.findOne(id, userId);
    await this.uploads.removeIfOwned(existing.imageUrl, userId);
    return this.prisma.anime.delete({ where: { id } });
  }
}
