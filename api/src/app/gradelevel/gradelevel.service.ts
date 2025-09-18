import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gradelevel } from './gradelevel.entity';

@Injectable()
export class GradelevelService {
  constructor(
    @InjectRepository(Gradelevel)
    private readonly gradelevelRepository: Repository<Gradelevel>
  ) {}

  async findAll(): Promise<Gradelevel[]> {
    return this.gradelevelRepository.find();
  }
}
