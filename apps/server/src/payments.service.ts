import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createMonobankLink(orderId: string, amount: number) {
    // return a mock URL (in real: call Monobank API)
    const url = `https://send.monobank.ua/jar/FAKE?order=${orderId}&amount=${amount}`;
    // store a pending transaction
    await this.prisma.transaction.create({ data: { orderId, amount } }).catch(()=>{});
    return url;
  }

  async createStripeSession(orderId: string, amount: number) {
    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{ price_data: { currency: 'uah', product_data: { name: `Order ${orderId}` }, unit_amount: amount * 100 }, quantity: 1 }],
      success_url: `${process.env.API_BASE_URL}/payments/success?order=${orderId}`,
      cancel_url: `${process.env.API_BASE_URL}/payments/cancel?order=${orderId}`,
    });
    await this.prisma.transaction.create({ data: { orderId, amount } }).catch(()=>{});
    return { id: session.id, url: session.url };
  }

  async handleWebhook(payload: any) {
    // payload example: { orderId, status, amount }
    if (payload?.orderId && payload?.status === 'CONFIRMED') {
      await this.prisma.transaction.create({ data: { orderId: payload.orderId, amount: payload.amount || 0 } });
      await this.prisma.order.update({ where: { id: payload.orderId }, data: { status: 'ASSIGNED' } }).catch(()=>{});
    }
    return { ok: true };
  }

  async createRefund(paymentIntentId: string) {
    try {
      const refund = await stripe.refunds.create({ payment_intent: paymentIntentId });
      return refund;
    } catch (e) {
      return { error: String(e) };
    }
  }

  async handleStripeEvent(payload: any, signature?: string) {
    // In real implementation verify signature with Stripe webhook secret
    if (payload?.type === 'checkout.session.completed') {
      const session = payload.data.object;
      const orderId = session.client_reference_id || session.metadata?.orderId;
      if (orderId) {
        await this.prisma.order.update({ where: { id: orderId }, data: { status: 'ASSIGNED' } }).catch(()=>{});
      }
    }
    return { ok: true };
  }
}


