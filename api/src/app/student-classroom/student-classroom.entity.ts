import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../student/student.entity';
import { Classroom } from '../classroom/classroom.entity';

@Entity('student_classroom')
export class StudentClassroom {
  @PrimaryGeneratedColumn({ name: 'student_classroom_id' })
  studentClassroomId!: number;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentid' })
  student!: Student;

  @ManyToOne(() => Classroom)
  @JoinColumn({ name: 'classroomid' })
  classroom!: Classroom;
}
