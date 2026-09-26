import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UploadsModule } from '../uploads/uploads.module';
import { AnimeService } from './anime.service';
import { AnimeController } from './anime.controller';

@Module({
  imports: [AuthModule, UploadsModule],
  controllers: [AnimeController],
  providers: [AnimeService],
})
export class AnimeModule {}
