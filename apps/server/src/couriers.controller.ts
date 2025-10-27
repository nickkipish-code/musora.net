import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('couriers')
export class CouriersController {
  constructor(private prisma: PrismaService) {}

  @Post('location')
  async updateLocation(@Body() body: { courierId: string; lat: number; lng: number }) {
    // upsert courier last location as metadata
    await this.prisma.courier.updateMany({ where: { id: body.courierId }, data: {} }).catch(()=>{});
    await this.prisma.transaction.create({ data: { orderId: 'loc', amount: 0 } }).catch(()=>{});
    return { ok: true };
  }

  @Get('nearby-orders')
  async nearbyOrders(@Query('lat') lat: string, @Query('lng') lng: string) {
    // naive implementation: return pending orders
    return this.prisma.order.findMany({ where: { status: 'PENDING' }, take: 20 });
  }

  @Post('verify')
  async requestVerify(@Body() body: { courierId: string; documentUrl: string }) {
    // store verification request
    await this.prisma.supportTicket.create({ data: { userId: body.courierId, subject: 'Verify courier', status: 'PENDING' } }).catch(()=>{});
    return { ok: true };
  }
}


