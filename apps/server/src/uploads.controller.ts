import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UploadsService } from './uploads.service';
import fetch from 'node-fetch';

@Controller('uploads')
export class UploadsController {
  constructor(private prisma: PrismaService, private uploads: UploadsService) {}

  @Post('order-photo')
  async uploadOrderPhoto(@Body() body: { orderId: string; filename: string; data: string }) {
    const buf = Buffer.from(body.data, 'base64');
    // if SUPABASE_URL and SUPABASE_KEY are configured, attempt upload to Supabase storage
    if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
      try {
        const filePath = `public/${Date.now()}-${body.filename}`;
        const res = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/public/${filePath}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.SUPABASE_KEY}`, 'Content-Type': 'application/octet-stream' },
          body: buf,
        });
        if (res.ok) {
          const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${filePath}`;
          await this.prisma.order.update({ where: { id: body.orderId }, data: { photos: { push: publicUrl } } }).catch(()=>{});
          return { ok: true, path: publicUrl };
        }
      } catch (e) {
        // fallback to local
      }
    }
    const path = this.uploads.saveLocal(body.filename, buf);
    await this.prisma.order.update({ where: { id: body.orderId }, data: { photos: { push: path } } }).catch(()=>{});
    return { ok: true, path };
  }
}


