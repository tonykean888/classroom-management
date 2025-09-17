import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PrefixType {
  @Field(() => Int)
  prefixid!: number;

  @Field()
  prefixname!: string;
}