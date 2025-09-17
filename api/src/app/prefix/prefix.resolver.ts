import { Resolver, Query } from '@nestjs/graphql';
import { PrefixType } from './prefix.graphql';
import { PrefixService } from './prefix.service';

@Resolver(() => PrefixType)
export class PrefixResolver {
  constructor(private readonly prefixService: PrefixService) {}

  @Query(() => [PrefixType])
  async prefixes() {
    return this.prefixService.findAll();
  }
}