import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { EnvironmentModule } from './@common/environment/environment.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './@infra/prisma/prisma.module';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import * as redisStore from 'cache-manager-redis-store';
import { EnvironmentService } from './@common/environment/environment.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: (envService: EnvironmentService) => ({
        isGlobal: true,
        store: redisStore,
        host: envService.REDIS_HOST,
        port: envService.REDIS_PORT,
        ttl: 60,
        max: 100,
      }),
    }),
    EnvironmentModule,
    UserModule,
    PrismaModule,
    AccountModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [EnvironmentService],
})
export class AppModule {}
