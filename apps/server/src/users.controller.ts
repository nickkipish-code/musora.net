import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get(':id')
  // allow admin or the owner of the resource
  @Roles('admin')
  async getUser(@Param('id') id: string, @Req() req: any) {
    const requester = req.user;
    if (!requester) return null;
    if (requester.role !== 'admin' && requester.sub !== id) return null;
    return this.prisma.user.findUnique({ where: { id } });
  }
}


