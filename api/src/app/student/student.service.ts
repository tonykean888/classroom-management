import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentInput, UpdateStudentInput } from './student.input';
import { Gender } from '../gender/gender.entity';
import { Prefix } from '../prefix/prefix.entity';
import { Gradelevel } from '../gradelevel/gradelevel.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Gender)
    private readonly genderRepository: Repository<Gender>,
    @InjectRepository(Prefix)
    private readonly prefixRepository: Repository<Prefix>,
    @InjectRepository(Gradelevel)
    private readonly gradelevelRepository: Repository<Gradelevel>
  ) {}

  async findAll(
    search?: string,
    gradelevelid?: number,
    classroomid?: number
  ): Promise<Student[]> {
    const query = this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.gradelevel', 'gradelevel')
      .leftJoinAndSelect('student.gender', 'gender')
      .leftJoinAndSelect('student.prefix', 'prefix');

    if (classroomid) {
      // If classroomId is provided, filter by classroom
      query.andWhere('student.classroom.classroomid = :classroomid', {
        classroomid,
      });
    }

    if (search) {
      query.where(
        'student.studentid LIKE :search OR  student.firstname LIKE :search OR student.lastname LIKE :search',
        {
          search: `%${search}%`,
        }
      );
    }

    if (gradelevelid) {
      query.andWhere('student.gradelevelid = :gradelevelid', { gradelevelid });
    }

    return query.getMany();
  }

  async findOne(studentid: number): Promise<Student | null> {
    return this.studentRepository.findOne({
      where: { studentid },
      relations: ['gender', 'prefix', 'gradelevel'],
    });
  }
  async findClassrooms(studentId: number) {
    const student = await this.studentRepository.findOne({
      where: { studentid: studentId },
      relations: ['studentClassrooms', 'studentClassrooms.classroom'],
    });

    if (!student || !student.studentClassrooms) {
      return [];
    }

    return student.studentClassrooms.map((sc) => sc.classroom);
  }

  async findGradeLevel(studentId: number) {
    const student = await this.studentRepository.findOne({
      where: { studentid: studentId },
      relations: ['gradelevel'],
    });

    return student?.gradelevel;
  }

  async findPrefix(studentId: number) {
    const student = await this.studentRepository.findOne({
      where: { studentid: studentId },
      relations: ['prefix'],
    });

    return student?.prefix;
  }

  async findGender(studentId: number) {
    const student = await this.studentRepository.findOne({
      where: { studentid: studentId },
      relations: ['gender'],
    });

    return student?.gender;
  }

  // เมทอดสำหรับเพิ่มนักเรียน
  async create(input: CreateStudentInput): Promise<Student> {
    const student = new Student();
    student.firstname = input.firstname;
    student.lastname = input.lastname;
    student.birthdate = input.birthdate;
    student.gender =
      (await this.genderRepository.findOneBy({ genderid: input.genderid })) ??
      undefined;
    student.prefix =
      (await this.prefixRepository.findOneBy({ prefixid: input.prefixid })) ??
      undefined;
    student.gradelevel =
      (await this.gradelevelRepository.findOneBy({
        gradelevelid: input.gradelevelid,
      })) ?? undefined;

    return this.studentRepository.save(student);
  }

  // เมทอดสำหรับแก้ไขข้อมูลนักเรียน
  async update(input: UpdateStudentInput): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { studentid: input.studentid },
    });

    if (!student) {
      throw new Error('Student not found');
    }
    if (input.firstname) {
      student.firstname = input.firstname;
    }

    if (input.lastname) {
      student.lastname = input.lastname;
    }

    if (input.birthdate) {
      student.birthdate = new Date(input.birthdate);
    }
    if (input.prefixid) {
      const prefix = await this.prefixRepository.findOne({
        where: { prefixid: input.prefixid },
      });
      if (prefix) {
        student.prefix = prefix;
      }
    }

    if (input.genderid) {
      const gender = await this.genderRepository.findOne({
        where: { genderid: input.genderid },
      });
      if (gender) {
        student.gender = gender;
      }
    }

    if (input.gradelevelid) {
      const gradelevel = await this.gradelevelRepository.findOne({
        where: { gradelevelid: input.gradelevelid },
      });
      if (gradelevel) {
        student.gradelevel = gradelevel;
      }
    }

    return this.studentRepository.save(student);
  }

  // Method to find students who are not in any classroom
  async findStudentsWithoutClassroom(): Promise<Student[]> {
    try {
      // Get students that don't have a classroom assigned
      const result = await this.studentRepository
        .createQueryBuilder('student')
        .where('student.classroomid IS NULL')
        .leftJoinAndSelect('student.gender', 'gender')
        .leftJoinAndSelect('student.prefix', 'prefix')
        .leftJoinAndSelect('student.gradelevel', 'gradelevel')
        .getMany();

      return result;
    } catch (error) {
      console.error('Error finding students without classroom:', error);
      return [];
    }
  }

  // เมทอดสำหรับลบข้อมูลนักเรียน
  async delete(studentid: number): Promise<boolean> {
    try {
      console.log(
        'Service attempting to delete student with ID:',
        studentid,
        'type:',
        typeof studentid
      );

      if (!studentid || isNaN(studentid)) {
        console.error('Invalid studentid received:', studentid);
        return false;
      }

      // Check if the student exists first
      const student = await this.studentRepository.findOne({
        where: { studentid },
      });
      if (!student) {
        console.log('Student not found with ID:', studentid);
        return false;
      }

      console.log('Found student to delete:', student);
      const result = await this.studentRepository.delete({ studentid });
      console.log('Delete result:', result);

      // If affected rows is greater than 0, deletion was successful
      const success = result.affected ? result.affected > 0 : false;
      console.log('Delete success:', success);
      return success;
    } catch (error) {
      console.error('Error deleting student:', error);
      return false;
    }
  }

  async save(student: Student): Promise<Student> {
    return this.studentRepository.save(student);
  }
}
