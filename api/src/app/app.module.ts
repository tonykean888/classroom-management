import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Student } from './student/student.entity';
import { Classroom } from './classroom/classroom.entity';
import { Prefix } from './prefix/prefix.entity';
import { Gender } from './gender/gender.entity';
import { Gradelevel } from './gradelevel/gradelevel.entity';
import { StudentClassroom } from './student-classroom/student-classroom.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { StudentModule } from './student/student.module';
import { ClassroomModule } from './classroom/classroom.module';
import { GradelevelModule } from './gradelevel/gradelevel.module';
import { GenderModule } from './gender/gender.module';
import { PrefixModule } from './prefix/prefix.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          Student,
          Classroom,
          Prefix,
          Gender,
          Gradelevel,
          StudentClassroom,
        ],
        synchronize: configService.get('DB_SYNC'),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      debug: true,
      playground: true,
      formatError: (error) => {
        console.error('GraphQL Error:', error);
        return error;
      },
    }),
    StudentModule,
    ClassroomModule,
    GradelevelModule,
    GenderModule,
    PrefixModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
