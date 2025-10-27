import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list() {
    return this.prisma.transaction.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  }
}


