import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from '../student/student.entity';

@Entity('prefix')
export class Prefix {
  @PrimaryGeneratedColumn({ name: 'prefixid' })
  prefixid!: number;

  @Column({ name: 'prefixname', length: 10 })
  prefixname!: string;

  @OneToMany(() => Student, (student) => student.prefix)
  students!: Student[];
}
