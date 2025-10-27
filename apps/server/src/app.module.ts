import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { UsersModule } from './users.module';
import { PrismaModule } from './prisma.module';
import { OrdersModule } from './orders.module';
import { PaymentsModule } from './payments.module';
import { CouriersController } from './couriers.controller';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, OrdersModule, PaymentsModule],
  controllers: [CouriersController, UploadsController, TransactionsController],
  providers: [UploadsService],
})
export class AppModule {}

  controllers: [],
  providers: [],
})
export class AppModule {}


