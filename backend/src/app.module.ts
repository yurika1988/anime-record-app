import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimeModule } from './anime/anime.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [PrismaModule, AuthModule, UploadsModule, AnimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
