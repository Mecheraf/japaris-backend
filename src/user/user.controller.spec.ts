import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';   
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailService } from '../services/mail/mail.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByEmail: jest.fn(),
            find: jest.fn(),
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

    controller = module.get(UserController);
    service = module.get(UserService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
        const expected = [{ id: 1, name: 'Admin Tanaka'}] as User[];
        jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve(expected));
        expect(await controller.findAll()).toBe(expected); //check if the result is the same as the expected
    });
  });

  
  describe('findOne', () => {
    it('should return a user', async () => {
        const expected = { id: 1, name: 'Admin Tanaka' } as User;
        jest.spyOn(service, 'findOne').mockImplementation((id) => Promise.resolve({ ...expected, id }));
        const result = await controller.findOne(1);
        expect(result).toEqual(expected);
    });
  });

/*
  describe('create', () => {
    it('should create a user', async () => {
      const result = await controller.create({ id: -1, name: 'John Doe', email: 'john.doe@example.com', password: 'password', createdAt: new Date(), updatedAt: new Date(), isAdmin: false, isActive: true, nationality: 'American' });
      expect(result).toEqual({ id: -1, name: 'John Doe', email: 'john.doe@example.com', password: 'password', createdAt: new Date(), updatedAt: new Date(), isAdmin: false, isActive: true, nationality: 'American' });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const result = await controller.update(-1, { name: 'John Doe', email: 'john.doe@example.com', password: 'password', createdAt: new Date(), updatedAt: new Date(), isAdmin: false, isActive: true, nationality: 'American' });
      expect(result).toEqual({ id: -1, name: 'John Doe', email: 'john.doe@example.com', password: 'password', createdAt: new Date(), updatedAt: new Date(), isAdmin: false, isActive: true, nationality: 'American' });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = await controller.remove(-1);
      expect(result).toEqual({ id: 1, name: 'John Doe', email: 'john.doe@example.com', password: 'password', createdAt: new Date(), updatedAt: new Date(), isAdmin: false, isActive: true, nationality: 'American' });
    });
  });
  */
});