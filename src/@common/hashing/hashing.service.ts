import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  constructor() {}

  private readonly saltOrRounds = 10;

  async hash(textToHash: string): Promise<string> {
    return await bcrypt.hash(textToHash, this.saltOrRounds);
  }

  async compare(
    textToCompare: string,
    hashToCompare: string,
  ): Promise<boolean> {
    return await bcrypt.compare(textToCompare, hashToCompare);
  }
}
