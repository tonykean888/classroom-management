import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
