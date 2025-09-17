import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from '../student/student.entity';

@Entity('gender')
export class Gender {
  @PrimaryGeneratedColumn({ name: 'genderid' })
  genderid!: number;

  @Column({ name: 'gendername', length: 10 })
  gendername!: string;

  @OneToMany(() => Student, student => student.gender)
  students?: Student[];
}