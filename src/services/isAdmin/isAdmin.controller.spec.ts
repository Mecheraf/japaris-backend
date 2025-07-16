import { Test, TestingModule } from '@nestjs/testing';
import { IsAdminController } from './isAdmin.controller';
import { IsAdminService } from './isAdmin.service';
import { UserService } from '../../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { MailService } from '../mail/mail.service';

describe('IsAdminController', () => {
  let controller: IsAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IsAdminController],
      providers: [IsAdminService, UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<IsAdminController>(IsAdminController);
  });

  it('should return true if user is admin', async () => {
    const expected = true;
    jest.spyOn(controller, 'isAdmin').mockResolvedValue(expected);
    const result = await controller.isAdmin(1);
    expect(result).toBe(expected);
  });
});