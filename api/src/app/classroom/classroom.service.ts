import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classroom } from './classroom.entity';
import { CreateClassroomInput, UpdateClassroomInput } from './classroom.input';

@Injectable()
export class ClassroomService {
	constructor(
			@InjectRepository(Classroom)
			private readonly classroomRepository: Repository<Classroom>,
	) {}

	async findAll(): Promise<Classroom[]> {
			return this.classroomRepository.find();
	}

	async findOne(classroomid: number): Promise<Classroom|null> {
			return this.classroomRepository.findOneBy({ classroomid });
	}
	
	async findDistinctAcademicYears(): Promise<number[]> {
			const result = await this.classroomRepository
			.createQueryBuilder('classroom')
			.select('DISTINCT classroom.academicyear', 'academicyear')
			.getRawMany();
	
			return result.map(item => item.academicyear);
	}

  async create(input: CreateClassroomInput): Promise<Classroom> {
    const newClassroom = this.classroomRepository.create(input);
    return this.classroomRepository.save(newClassroom);
  }

  async update(input: UpdateClassroomInput): Promise<Classroom> {
    const classroom = await this.classroomRepository.preload({
      classroomid: input.classroomid,
      ...input,
    });
    if (!classroom) {
      throw new Error('Classroom not found');
    }
    return this.classroomRepository.save(classroom);
  }
  

  async delete(classroomid: number): Promise<Classroom> {
    const classroom = await this.findOne(classroomid);
    if (!classroom) {
      throw new Error('Classroom not found');
    }
    await this.classroomRepository.delete(classroomid);
    return classroom;
  }
}