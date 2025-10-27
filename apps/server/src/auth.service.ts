import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(email: string, password: string, name?: string) {
    const hashed = await bcrypt.hash(password, 12);
    const user = await this.prisma.user.create({ data: { email, name, passwordHash: hashed } });
    const payload = { sub: user.id, email: user.email, role: (user as any).role || 'user' };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = randomBytes(32).toString('hex');
    await this.prisma.refreshToken.create({ data: { userId: user.id, token: refreshToken } });
    // include role in result if present
    return { accessToken, refreshToken, role: (user as any).role || 'user' };
  }

  async login(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const payload = { sub: user.id, email: user.email, role: (user as any).role || 'user' };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = randomBytes(32).toString('hex');
    await this.prisma.refreshToken.create({ data: { userId: user.id, token: refreshToken } });
    return { accessToken, refreshToken, role: (user as any).role || 'user' };
  }

  async refresh(token: string) {
    const rt = await this.prisma.refreshToken.findUnique({ where: { token } });
    if (!rt || rt.revoked) throw new UnauthorizedException();
    const user = await this.prisma.user.findUnique({ where: { id: rt.userId } });
    if (!user) throw new UnauthorizedException();
    const payload = { sub: user.id, email: user.email };
    return { accessToken: this.jwtService.sign(payload) };
  }
}


