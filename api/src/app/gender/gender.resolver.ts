import { Resolver, Query } from '@nestjs/graphql';
import { GenderType } from './gender.graphql';
import { GenderService } from './gender.service';

@Resolver(() => GenderType)
export class GenderResolver {
  constructor(private readonly genderService: GenderService) {}

  @Query(() => [GenderType])
  async genders() {
    return this.genderService.findAll();
  }
}
