import { Test, TestingModule } from '@nestjs/testing';
import { DateHelper, MockFactory, OtpHelper } from '../../utils';
import { NotificationChannels, NotificationType } from '../../interfaces';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { Otp } from './otp.entity';

describe('OtpController', () => {
  let controller: OtpController;
  let otpService: OtpService;

  const mockOtpService = {
    create: jest.fn(dto => {
      const payload = {
        expirationDate: DateHelper.addToCurrent({
          minutes: 30,
        }),
        code: OtpHelper.generateOTP(6),
      };

      return {
        ...dto,
        payload,
      };
    }),

    verify: jest.fn().mockImplementation(dto =>
      Promise.resolve({
        id: 2,
        ...dto,
      })
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtpController],
      providers: [OtpService],
    })
      .overrideProvider(OtpService)
      .useValue(MockFactory.getMock(Otp))
      .compile();

    controller = module.get<OtpController>(OtpController);
    otpService = module.get<OtpService>(OtpService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Otp Service should be defind', () => {
    expect(otpService).toBeDefined();
  });

  it('should send otp', () => {
    const dto = {
      userIdentifier: '08012345678',
      channel: NotificationChannels.SMS,
      type: NotificationType.VERIFY_PHONE,
    };

    mockOtpService.create(dto);
    expect(mockOtpService.create).toHaveBeenCalled();
    expect(mockOtpService.create).toHaveBeenCalledWith(dto);
  });

  it('should verify otp', () => {
    const dto = {
      code: '234567',
      type: NotificationType.VERIFY_PHONE,
      userIdentifier: '08012345678',
    };
    mockOtpService.verify(dto);
    expect(mockOtpService.verify).toHaveBeenCalled();
    expect(mockOtpService.verify).toHaveBeenCalledWith(dto);
  });
});
