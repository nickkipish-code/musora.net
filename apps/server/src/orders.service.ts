import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.order.create({ data });
  }

  async listNearby(lat: number, lng: number, radius = 5000) {
    // naive: return recent pending orders
    return this.prisma.order.findMany({ where: { status: 'PENDING' }, take: 30 });
  }

  async listAll() {
    return this.prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  }

  async getById(id: string) {
    return this.prisma.order.findUnique({ where: { id } });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.order.update({ where: { id }, data: { status } });
  }
}


