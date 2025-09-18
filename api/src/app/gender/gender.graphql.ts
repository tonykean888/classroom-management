import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class GenderType {
  @Field(() => Int)
  genderid!: number;

  @Field()
  gendername!: string;
}
