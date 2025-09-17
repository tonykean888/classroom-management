import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prefix } from './prefix.entity';

@Injectable()
export class PrefixService {
  constructor(
    @InjectRepository(Prefix)
    private readonly prefixRepository: Repository<Prefix>,
  ) {}

  async findAll(): Promise<Prefix[]> {
    return this.prefixRepository.find();
  }
}