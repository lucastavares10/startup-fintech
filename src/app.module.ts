import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { EnvironmentModule } from './@common/environment/environment.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './@infra/prisma/prisma.module';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    EnvironmentModule,
    UserModule,
    PrismaModule,
    AccountModule,
    TransactionModule,
    CacheModule.register({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
