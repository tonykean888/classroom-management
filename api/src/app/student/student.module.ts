import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentResolver } from './student.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { StudentClassroom } from '../student-classroom/student-classroom.entity';
import { Classroom } from '../classroom/classroom.entity';
import { Gradelevel } from '../gradelevel/gradelevel.entity';
import { Prefix } from '../prefix/prefix.entity';
import { Gender } from '../gender/gender.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Student, StudentClassroom, Classroom, Gradelevel, Prefix, Gender])],
    providers: [StudentService, StudentResolver],
    exports: [StudentService],
})
export class StudentModule {}