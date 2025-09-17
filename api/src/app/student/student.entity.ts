import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Prefix } from '../prefix/prefix.entity';
import { Gender } from '../gender/gender.entity';
import { Gradelevel } from '../gradelevel/gradelevel.entity';
import { StudentClassroom } from '../student-classroom/student-classroom.entity';

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn({ name: 'studentid' })
  studentid!: number;

  @ManyToOne(() => Prefix)
  @JoinColumn({ name: 'prefixid' })
  prefix?: Prefix;

  @Column({ name: 'firstname', length: 50 })
  firstname!: string;

  @Column({ name: 'lastname', length: 50 })
  lastname!: string;

  @Column({ name: 'birthdate', type: 'date' })
  birthdate!: Date;

  @ManyToOne(() => Gender)
  @JoinColumn({ name: 'genderid' })
  gender?: Gender;

  @ManyToOne(() => Gradelevel)
  @JoinColumn({ name: 'gradelevelid' })
  gradelevel?: Gradelevel;

  @OneToMany(() => StudentClassroom, studentClassroom => studentClassroom.student)
  studentClassrooms?: StudentClassroom[];
}