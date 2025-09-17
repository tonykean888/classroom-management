import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsInt, IsString, IsDateString } from 'class-validator';

@InputType()
export class CreateStudentInput {
@Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  prefixid?: number;

  @Field()
  @IsString()
  firstname!: string;

  @Field()
  @IsString()
  lastname!: string;

  @Field(() => Date)
  @IsOptional()
  @IsDateString()
  birthdate!: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  genderid?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  gradelevelid?: number;
}

@InputType()
export class UpdateStudentInput {
  @Field(() => Int)
  studentid!: number;

  @Field(() => Int, { nullable: true })
  prefixid?: number;

  @Field({ nullable: true })
  firstname?: string;

  @Field({ nullable: true })
  lastname?: string;

  @Field(() => Date, { nullable: true })
  birthdate?: Date;

  @Field(() => Int, { nullable: true })
  genderid?: number;

  @Field(() => Int, { nullable: true })
  gradelevelid?: number;
}