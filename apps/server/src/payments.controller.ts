import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private svc: PaymentsService) {}

  @Post('create')
  async create(@Body() body: { orderId: string; amount: number }) {
    return this.svc.createMonobankLink(body.orderId, body.amount);
  }

  @Post('webhook')
  async webhook(@Body() body: any) {
    // Generic webhook endpoint (Monobank mock or generic payload)
    return this.svc.handleWebhook(body);
  }

  @Post('stripe-webhook')
  async stripeWebhook(@Body() body: { payload: any; signature: string }) {
    // Accepts { payload, signature } for simplified verification in this scaffold
    return this.svc.handleStripeEvent(body.payload, body.signature);
  }

  @Post('stripe/session')
  async createStripeSession(@Body() body: { orderId: string; amount: number }) {
    return this.svc.createStripeSession(body.orderId, body.amount);
  }

  @Post('stripe/refund')
  async refund(@Body() body: { paymentIntentId: string }) {
    return this.svc.createRefund(body.paymentIntentId);
  }
}


