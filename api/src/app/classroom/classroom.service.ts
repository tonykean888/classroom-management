import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classroom } from './classroom.entity';

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
}