import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ClassroomType } from '../classroom/classroom.graphql';
import { GradelevelType } from '../gradelevel/gradelevel.graphql';
import { GenderType } from '../gender/gender.graphql';
import { PrefixType } from '../prefix/prefix.graphql';
import { GraphQLString } from 'graphql';
@ObjectType('StudentType')
export class StudentType {
    @Field(() => Int)
    studentid!: number;

    @Field()
    firstname!: string;

    @Field()
    lastname!: string;
    
    @Field(() => GraphQLString)
    birthdate!: string;

    @Field(() => [ClassroomType],{ nullable: true }) 
    classrooms?: ClassroomType[];

    @Field(() => GradelevelType, { nullable: true })
    gradelevel?: GradelevelType;

    @Field(() => GenderType, { nullable: true })
    gender?: GenderType;
    
    @Field(() => PrefixType, { nullable: true })
    prefix?: PrefixType;
}
