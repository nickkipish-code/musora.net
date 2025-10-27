import { Module } from '@nestjs/common';
import { CouriersController } from './couriers.controller';

@Module({
  controllers: [CouriersController]
})
export class CouriersModule {}


