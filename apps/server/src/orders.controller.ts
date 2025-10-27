import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Post()
  async create(@Body() body: any) {
    return this.orders.create(body);
  }

  @Get('nearby')
  async nearby(@Query('lat') lat: string, @Query('lng') lng: string) {
    return this.orders.listNearby(Number(lat), Number(lng));
  }

  @Get()
  async listAll() {
    return this.orders.listAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.orders.getById(id);
  }

  @Post(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.orders.updateStatus(id, status);
  }
}


