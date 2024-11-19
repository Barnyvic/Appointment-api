import { Body, Controller, Post } from '@nestjs/common';
import { HttpResponse } from '../../utils';
import { SendOtpDTO, VerifyOtpDto } from './dto';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('/send')
  async send(@Body() sendOtpDto: SendOtpDTO) {
    await this.otpService.send(sendOtpDto);

    return HttpResponse.success({ data: '', message: 'OTP sent successfully' });
  }

  @Post('/verify')
  async verify(@Body() verifyOtpDto: VerifyOtpDto) {
    await this.otpService.verify(verifyOtpDto);

    return HttpResponse.success({
      data: '',
      message: 'OTP verified successfully',
    });
  }
}
