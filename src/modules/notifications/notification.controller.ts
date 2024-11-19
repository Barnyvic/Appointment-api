import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { NotificationMessageType, IUser } from 'src/interfaces';
import { User } from '../../decorators';
import { AuthGuard } from '../../guards';
import { HttpResponse } from '../../utils';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@User() user: IUser) {
    const data = await this.notificationService.get(user.id);

    return HttpResponse.success({ data, message: 'Notification fetched' });
  }

  @Post('send')
  async sendNotification(@Body() body: NotificationMessageType) {
    // dataType: NotificationMessageType) {
    const data = await this.notificationService.sendNotificationMessage(body);

    return HttpResponse.success({ data, message: 'Notification sent' });
  }
}
