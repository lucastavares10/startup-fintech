import { Module } from '@nestjs/common';
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
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
