import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { ClassroomType } from './classroom.graphql';
import { ClassroomService } from './classroom.service';

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
}