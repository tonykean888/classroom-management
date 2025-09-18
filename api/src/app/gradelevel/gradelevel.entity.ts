import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from '../student/student.entity';

@Entity('gradelevel')
export class Gradelevel {
  @PrimaryGeneratedColumn({ name: 'gradelevelid' })
  gradelevelid!: number;

  @Column({ name: 'levelname', length: 10 })
  levelname!: string;

  @OneToMany(() => Student, (student) => student.gradelevel)
  students?: Student[];
}
