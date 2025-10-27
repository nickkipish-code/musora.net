import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersController } from './users.controller';

@Module({
  providers: [PrismaService],
  controllers: [UsersController]
})
export class UsersModule {}


