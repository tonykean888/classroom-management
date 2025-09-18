import {
  Resolver,
  Query,
  Args,
  ID,
  ResolveField,
  Parent,
  Mutation,
  Int,
} from '@nestjs/graphql';
import { StudentType } from './student.graphql';
import { StudentService } from './student.service';
import { ClassroomType } from '../classroom/classroom.graphql';
import { GradelevelType } from '../gradelevel/gradelevel.graphql';
import { PrefixType } from '../prefix/prefix.graphql';
import { CreateStudentInput, UpdateStudentInput } from './student.input';
import { GenderType } from '../gender/gender.graphql';
@Resolver(() => StudentType)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Query(() => [StudentType])
  async students(
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('gradelevelid', { type: () => Int, nullable: true })
    gradelevelid?: number,
    @Args('classroomid', { type: () => Int, nullable: true })
    classroomid?: number
  ) {
    return this.studentService.findAll(search, gradelevelid, classroomid);
  }

  @Query(() => StudentType)
  async student(@Args('studentid', { type: () => ID }) studentid: number) {
    return this.studentService.findOne(studentid);
  }
  @ResolveField('classrooms', () => [ClassroomType], { nullable: true })
  async getClassrooms(@Parent() student: StudentType) {
    return this.studentService.findClassrooms(student.studentid);
  }

  @ResolveField('prefix', () => PrefixType, { nullable: true })
  async getPrefix(@Parent() student: StudentType) {
    return this.studentService.findPrefix(student.studentid);
  }

  @ResolveField('gradelevel', () => GradelevelType, { nullable: true })
  async getGradeLevel(@Parent() student: StudentType) {
    return this.studentService.findGradeLevel(student.studentid);
  }

  @ResolveField('gender', () => GenderType, { nullable: true })
  async getGender(@Parent() student: StudentType) {
    return this.studentService.findGender(student.studentid);
  }

  @Query(() => [StudentType])
  async studentsWithoutClassroom() {
    return this.studentService.findStudentsWithoutClassroom();
  }

  @Mutation(() => StudentType)
  async createStudent(@Args('input') input: CreateStudentInput) {
    return this.studentService.create(input);
  }

  @Mutation(() => StudentType)
  async updateStudent(@Args('input') input: UpdateStudentInput) {
    return this.studentService.update(input);
  }

  @Mutation(() => Boolean)
  async deleteStudent(
    @Args('studentid', { type: () => ID }) studentid: string
  ): Promise<boolean> {
    try {
      console.log(
        'Resolver received delete request for studentid:',
        studentid,
        'type:',
        typeof studentid
      );
      const numericId = parseInt(studentid, 10);
      const result = await this.studentService.delete(numericId);
      return result;
    } catch (error) {
      console.error('Error in deleteStudent resolver:', error);
      throw error;
    }
  }
}
