import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gradelevel } from './gradelevel.entity';
import { GradelevelService } from './gradelevel.service';
import { GradelevelResolver } from './gradelevel.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Gradelevel])],
  providers: [GradelevelService, GradelevelResolver],
})
export class GradelevelModule {}
