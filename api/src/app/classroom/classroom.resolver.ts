import { Resolver, Query, Args, ID, Mutation, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ClassroomType } from './classroom.graphql';
import { ClassroomService } from './classroom.service';
import { CreateClassroomInput, UpdateClassroomInput } from './classroom.input';
import { StudentType } from '../student/student.graphql';

@Resolver(() => ClassroomType)
export class ClassroomResolver {
  constructor(private readonly classroomService: ClassroomService) {}

	@Query(() => [ClassroomType])
	async classrooms(): Promise<ClassroomType[]> {
			return this.classroomService.findAll();
	}

	@Query(() => ClassroomType)
	async classroom(@Args('classroomid', { type: () => ID }) classroomid: number): Promise<ClassroomType|null> {
			return this.classroomService.findOne(classroomid);
	}

	@Query(() => [Number])
	async academicYears() {
			return this.classroomService.findDistinctAcademicYears();
	}
	
	@Query(() => [ClassroomType], { name: 'searchClassrooms' })
  async searchClassrooms(
    @Args('classroomId', { type: () => Int, nullable: true })
    classroomId?: number,
    @Args('classroomName', { nullable: true })
    classroomName?: string,
    @Args('homeroomTeacherName', { nullable: true })
    homeroomTeacherName?: string,
  ) {
    return this.classroomService.searchClassrooms(
      classroomId,
      classroomName,
      homeroomTeacherName,
    );
  }
	
	@ResolveField('students', () => [StudentType], { nullable: true })
	async getStudents(@Parent() classroom: ClassroomType) {
		return this.classroomService.findStudentsInClassroom(classroom.classroomid);
	}
	// Mutation สำหรับเพิ่มห้องเรียน
  @Mutation(() => ClassroomType)
  async createClassroom(@Args('input') input: CreateClassroomInput) {
    return this.classroomService.create(input);
  }

  // Mutation สำหรับแก้ไขข้อมูลห้องเรียน
  @Mutation(() => ClassroomType)
  async updateClassroom(@Args('input') input: UpdateClassroomInput) {
    return this.classroomService.update(input);
  }

  // Mutation สำหรับลบข้อมูลห้องเรียน
  @Mutation(() => ClassroomType)
  async deleteClassroom(@Args('classroomid', { type: () => Int }) classroomid: number) {
    return this.classroomService.delete(classroomid);
  }

	  @Mutation(() => ClassroomType)
  async addStudentToClassroom(
    @Args('classroomid', { type: () => Int }) classroomid: number,
    @Args('studentid', { type: () => Int }) studentid: number,
  ) {
    return this.classroomService.addStudentToClassroom(classroomid, studentid);
  }

  @Mutation(() => ClassroomType)
  async removeStudentFromClassroom(
    @Args('classroomid', { type: () => Int }) classroomid: number,
    @Args('studentid', { type: () => Int }) studentid: number,
  ) {
    return this.classroomService.removeStudentFromClassroom(classroomid, studentid);
  }
}