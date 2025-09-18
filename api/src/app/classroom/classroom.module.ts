import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomResolver } from './classroom.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classroom } from './classroom.entity';
import { StudentModule } from '../student/student.module';
import { StudentClassroom } from '../student-classroom/student-classroom.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Classroom, StudentClassroom]), StudentModule],
  providers: [ClassroomService, ClassroomResolver],
})
export class ClassroomModule {}