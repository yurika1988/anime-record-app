import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { imageUploadOptions } from '../uploads/image-file.filter';
import { AnimeService } from './anime.service';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';

@UseGuards(JwtAuthGuard)
@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', imageUploadOptions()))
  create(
    @CurrentUser() user: AuthUser,
    @Body() createAnimeDto: CreateAnimeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.animeService.create(user.userId, createAnimeDto, file);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.animeService.findAll(user.userId);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.animeService.findOne(id, user.userId);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions()))
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAnimeDto: UpdateAnimeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.animeService.update(id, user.userId, updateAnimeDto, file);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.animeService.remove(id, user.userId);
  }
}
