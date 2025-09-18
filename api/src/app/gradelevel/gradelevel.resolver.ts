import { Resolver, Query } from '@nestjs/graphql';
import { GradelevelType } from './gradelevel.graphql';
import { GradelevelService } from './gradelevel.service';

@Resolver(() => GradelevelType)
export class GradelevelResolver {
  constructor(private readonly gradelevelService: GradelevelService) {}

  @Query(() => [GradelevelType])
  async gradelevels() {
    return this.gradelevelService.findAll();
  }
}
