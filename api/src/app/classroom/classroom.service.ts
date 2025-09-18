import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classroom } from './classroom.entity';
import { CreateClassroomInput, UpdateClassroomInput } from './classroom.input';
import { StudentService } from '../student/student.service';
import { StudentClassroom } from '../student-classroom/student-classroom.entity';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
    @InjectRepository(StudentClassroom)
    private readonly studentClassroomRepository: Repository<StudentClassroom>,
    private readonly studentService: StudentService
  ) {}

  async findAll(): Promise<Classroom[]> {
    return this.classroomRepository.find();
  }

  async findOne(classroomid: number): Promise<Classroom | null> {
    return this.classroomRepository.findOneBy({ classroomid });
  }

  async findDistinctAcademicYears(): Promise<number[]> {
    const result = await this.classroomRepository
      .createQueryBuilder('classroom')
      .select('DISTINCT classroom.academicyear', 'academicyear')
      .getRawMany();

    return result.map((item) => item.academicyear);
  }

  async create(input: CreateClassroomInput): Promise<Classroom> {
    const newClassroom = this.classroomRepository.create(input);
    return this.classroomRepository.save(newClassroom);
  }

  async update(input: UpdateClassroomInput): Promise<Classroom> {
    const classroom = await this.classroomRepository.preload({
      classroomid: input.classroomid,
      ...input,
    });
    if (!classroom) {
      throw new Error('Classroom not found');
    }
    return this.classroomRepository.save(classroom);
  }

  async delete(classroomid: number): Promise<Classroom> {
    const classroom = await this.findOne(classroomid);
    if (!classroom) {
      throw new Error('Classroom not found');
    }
    await this.classroomRepository.delete(classroomid);
    return classroom;
  }
  async addStudentToClassroom(
    classroomid: number,
    studentid: number
  ): Promise<Classroom> {
    console.log(`Adding student ${studentid} to classroom ${classroomid}`);

    const classroom = await this.classroomRepository.findOne({
      where: { classroomid },
    });
    const student = await this.studentService.findOne(studentid);

    if (!classroom || !student) {
      throw new Error('Classroom or Student not found');
    }

    // Check if relation already exists
    const existingRelation = await this.studentClassroomRepository.findOne({
      where: {
        student: { studentid },
        classroom: { classroomid },
      },
    });

    if (existingRelation) {
      console.log('Relation already exists');
      return classroom;
    }

    // Create a new StudentClassroom entry
    const studentClassroom = new StudentClassroom();
    studentClassroom.student = student;
    studentClassroom.classroom = classroom;

    console.log('Creating student-classroom relation:', studentClassroom);
    await this.studentClassroomRepository.save(studentClassroom);
    console.log('Relation created successfully');

    return classroom;
  }

  async removeStudentFromClassroom(
    classroomid: number,
    studentid: number
  ): Promise<Classroom> {
    console.log(`Removing student ${studentid} from classroom ${classroomid}`);

    const classroom = await this.classroomRepository.findOne({
      where: { classroomid },
    });

    if (!classroom) {
      throw new Error('Classroom not found');
    }

    // Find the relation
    const relation = await this.studentClassroomRepository.findOne({
      where: {
        student: { studentid },
        classroom: { classroomid },
      },
    });

    if (!relation) {
      console.log('Relation not found');
      return classroom;
    }

    // Delete the relation
    console.log('Deleting relation:', relation);
    await this.studentClassroomRepository.remove(relation);
    console.log('Relation deleted successfully');

    return classroom;
  }

  async findStudentsInClassroom(classroomid: number) {
    try {
      console.log(`Finding students in classroom ${classroomid}`);

      // Query the student-classroom junction table to get students
      const studentClassrooms = await this.studentClassroomRepository.find({
        where: { classroom: { classroomid } },
        relations: [
          'student',
          'student.gender',
          'student.prefix',
          'student.gradelevel',
        ],
      });

      // Extract the student objects from the results
      const students = studentClassrooms.map((sc) => sc.student);
      console.log(
        `Found ${students.length} students in classroom ${classroomid}`
      );

      return students;
    } catch (error) {
      console.error(
        `Error finding students in classroom ${classroomid}:`,
        error
      );
      return [];
    }
  }

  async searchClassrooms(searchValue?: string): Promise<Classroom[]> {
    const query = this.classroomRepository.createQueryBuilder('classroom');

    if (searchValue) {
      query.where(
        'classroom.homeroomTeacher LIKE :search OR classroom.classroom LIKE :search OR classroom.homeroom_teacher LIKE :search',
        {
          search: `%${searchValue}%`,
        }
      );
    }
    return query.getMany();
  }
}
