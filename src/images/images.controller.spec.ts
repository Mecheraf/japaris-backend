import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Images } from './images.entity';

describe('ImagesController', () => {
  let controller: ImagesController;
  let service: ImagesService;

  const mockImagesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByEventId: jest.fn(),
    findByJobId: jest.fn(),
    remove: jest.fn(),
    getFilePath: jest.fn(),
    associateWithEvent: jest.fn(),
    associateWithJob: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [
        {
          provide: ImagesService,
          useValue: mockImagesService,
        },
      ],
    }).compile();

    controller = module.get<ImagesController>(ImagesController);
    service = module.get<ImagesService>(ImagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of uploads', async () => {
      const result: Images[] = [];
      mockImagesService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockImagesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single upload', async () => {
      const result = new Images();
      result.id = 1;
      mockImagesService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
      expect(mockImagesService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw error if upload not found', async () => {
      mockImagesService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByEventId', () => {
    it('should return uploads for an event', async () => {
      const result: Images[] = [];
      mockImagesService.findByEventId.mockResolvedValue(result);

      expect(await controller.findByEventId(1)).toBe(result);
      expect(mockImagesService.findByEventId).toHaveBeenCalledWith(1);
    });
  });

  describe('findByJobId', () => {
    it('should return uploads for a job', async () => {
      const result: Images[] = [];
      mockImagesService.findByJobId.mockResolvedValue(result);

      expect(await controller.findByJobId(1)).toBe(result);
      expect(mockImagesService.findByJobId).toHaveBeenCalledWith(1);
    });
  });

  describe('uploadFile', () => {
    it('should throw error if no file uploaded', async () => {
      await expect(
        controller.uploadFile(null as any, 1),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error if both eventId and jobId provided', async () => {
      const mockFile = {
        filename: 'test.jpg',
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        path: '/path/to/file',
      } as Express.Multer.File;

      await expect(
        controller.uploadFile(mockFile, 1, 1),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error if neither eventId nor jobId provided', async () => {
      const mockFile = {
        filename: 'test.jpg',
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        path: '/path/to/file',
      } as Express.Multer.File;

      await expect(
        controller.uploadFile(mockFile),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create upload successfully', async () => {
      const mockFile = {
        filename: 'test.jpg',
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        path: '/path/to/file',
      } as Express.Multer.File;

      const result = new Images();
      mockImagesService.create.mockResolvedValue(result);

      expect(await controller.uploadFile(mockFile, 1)).toBe(result);
      expect(mockImagesService.create).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an upload', async () => {
      mockImagesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);
      expect(result).toEqual({ message: 'Upload deleted successfully' });
      expect(mockImagesService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('associateWithEvent', () => {
    it('should associate upload with event', async () => {
      const result = new Images();
      mockImagesService.associateWithEvent.mockResolvedValue(result);

      expect(await controller.associateWithEvent(1, 1)).toBe(result);
      expect(mockImagesService.associateWithEvent).toHaveBeenCalledWith(1, 1);
    });

    it('should throw error if eventId not provided', async () => {
      await expect(controller.associateWithEvent(1, null as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('associateWithJob', () => {
    it('should associate upload with job', async () => {
      const result = new Images();
      mockImagesService.associateWithJob.mockResolvedValue(result);

      expect(await controller.associateWithJob(1, 1)).toBe(result);
      expect(mockImagesService.associateWithJob).toHaveBeenCalledWith(1, 1);
    });

    it('should throw error if jobId not provided', async () => {
      await expect(controller.associateWithJob(1, null as any)).rejects.toThrow(BadRequestException);
    });
  });
});
