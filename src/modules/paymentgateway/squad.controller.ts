import { Body, Controller, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { SquadService } from './squad.service';
import { HttpResponse } from 'src/utils';
import { AuthGuard } from 'src/guards';
import { User } from 'src/decorators';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { IUser } from 'src/interfaces';
import { SquadWebhookBody } from 'src/interfaces/squad.interface';

@Controller('squad')
export class SquadController {
  constructor(private readonly squadService: SquadService) {}

  @Post('initiate-payment')
  @UseGuards(AuthGuard)
  async initiatePayment(@User() user: IUser, @Body() dto: InitiatePaymentDto) {
    const data = await this.squadService.initiatePayment({
      userId: user.id,
      email: user.emailAddress,
      amount: dto.amount,
      serviceId: dto.serviceId,
      metadata: {
        userId: user.id,
        reference: dto.reference || '',
      },
    });

    return HttpResponse.success({
      data,
      message: 'Successful',
    });
  }

  @Get('verify-payment/:reference')
  async verifyPayment(@Param('reference') reference: string) {
    const data = await this.squadService.verifyTransaction(reference);

    return HttpResponse.success({
      data,
      message: 'Successful',
    });
  }

  @Post('/webhook')
  async handleWebhookNotification(
    @Body() payload: SquadWebhookBody,
    @Headers() headers: any
  ): Promise<any> {
    const data = await this.squadService.handleWebhookNotification(payload, headers);
    return HttpResponse.success({
      data,
      message: 'Webhook notification handled successfully',
    });
  }
}
