import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType('GradelevelType')
export class GradelevelType {
  @Field(() => Int)
  gradelevelid!: number;

  @Field()
  levelname!: string;
}
