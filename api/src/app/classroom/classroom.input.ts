import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateClassroomInput {
  @Field()
  academicyear!: string;

  @Field()
  classroom!: string;

  @Field()
  homeroomTeacher!: string;
}

@InputType()
export class UpdateClassroomInput {
  @Field(() => Int)
  classroomid!: number;
  
  @Field({ nullable: true })
  academicyear!: string;

  @Field({ nullable: true })
  classroom!: string;

  @Field({ nullable: true })
  homeroomTeacher!: string;
}