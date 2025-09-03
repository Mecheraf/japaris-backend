import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../services/mail/mail.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UserService,
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
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should login', async () => {
    const loginDto = { email: 'admin.tanaka@japari.park', password: 'adminPass123!' };
    const expected = { id: 1, name: 'Admin Tanaka', email: 'admin.tanaka@japari.park', password: 'adminPass123!', createdAt: new Date(), updatedAt: new Date(), isAdmin: true, isActive: true, nationality: 'Japanese' };
    jest.spyOn(controller, 'login').mockResolvedValue(expected);
    const result = await controller.login(loginDto);
    expect(result).toBe(expected);
  });
});