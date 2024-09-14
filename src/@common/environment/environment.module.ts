import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { variables } from './variables.config';
import { EnvironmentService } from './environment.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [variables],
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
