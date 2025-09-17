import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { StudentClassroom } from '../student-classroom/student-classroom.entity';
import { Student } from '../student/student.entity';
@Entity('classroom')
export class Classroom {
  @PrimaryGeneratedColumn({ name: 'classroomid' })
  classroomid!: number;

  @Column({ name: 'classroom', length: 100 })
  classroom!: string;

  @Column({ name: 'academicyear' })
  academicyear!: number;

  @Column({ name: 'homeroom_teacher', length: 100 })
  homeroomTeacher!: string;


  @OneToMany(() => StudentClassroom, studentClassroom => studentClassroom.classroom)
  studentClassrooms!: StudentClassroom[];

  @OneToMany(() => Student, (student) => student.classroom)
  students?: Student[];
}