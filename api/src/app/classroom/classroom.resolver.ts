import { Resolver, Query, Args, ID,Mutation, Int  } from '@nestjs/graphql';
import { ClassroomType } from './classroom.graphql';
import { ClassroomService } from './classroom.service';
import { CreateClassroomInput, UpdateClassroomInput } from './classroom.input';

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
}