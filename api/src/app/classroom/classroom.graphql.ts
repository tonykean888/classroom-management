import { ObjectType, Field, ID } from '@nestjs/graphql';
import { StudentType } from '../student/student.graphql';

@ObjectType()
export class ClassroomType {
    @Field(() => ID)
    classroomid!: number;

    @Field()
    classroom!: string;

    @Field()
    academicyear?: number;

    @Field()
    homeroomTeacher?: string;

    @Field(() => [StudentType], { nullable: true })
    students?: StudentType[];
}