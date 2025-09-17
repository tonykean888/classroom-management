import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gender } from './gender.entity';
import { GenderService } from './gender.service';
import { GenderResolver } from './gender.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Gender])],
  providers: [GenderService, GenderResolver],
})
export class GenderModule {}