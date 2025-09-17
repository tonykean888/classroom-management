import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prefix } from './prefix.entity';
import { PrefixService } from './prefix.service';
import { PrefixResolver } from './prefix.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Prefix])],
  providers: [PrefixService, PrefixResolver],
})
export class PrefixModule {}