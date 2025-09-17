import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomResolver } from './classroom.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classroom } from './classroom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Classroom])],
  providers: [ClassroomService, ClassroomResolver],
})
export class ClassroomModule {}