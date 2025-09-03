import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event } from './event.entity';

describe('EventController', () => {
  let controller: EventController;
  let service: EventService;

  const mockEventService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByCategory: jest.fn(),
    findByStatus: jest.fn(),
    findUpcoming: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService,
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      const result: Event[] = [];
      mockEventService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockEventService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single event', async () => {
      const result = new Event();
      result.id = 1;
      mockEventService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
      expect(mockEventService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new event', async () => {
      const createEventDto = new Event();
      createEventDto.title = 'Test Event';
      createEventDto.description = 'Test Description';
      createEventDto.location = 'Test Location';
      createEventDto.startDate = new Date();
      createEventDto.endDate = new Date();
      createEventDto.organizer = 'Test Organizer';
      createEventDto.category = 'conference';
      createEventDto.contactEmail = 'test@example.com';

      const result = { ...createEventDto, id: 1 };
      mockEventService.create.mockResolvedValue(result);

      expect(await controller.create(createEventDto)).toBe(result);
      expect(mockEventService.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const updateEventDto = { title: 'Updated Event' };
      const existingEvent = new Event();
      existingEvent.id = 1;
      const updatedEvent = { ...existingEvent, ...updateEventDto };

      mockEventService.findOne.mockResolvedValue(existingEvent);
      mockEventService.update.mockResolvedValue(updatedEvent);

      expect(await controller.update(1, updateEventDto)).toBe(updatedEvent);
      expect(mockEventService.findOne).toHaveBeenCalledWith(1);
      expect(mockEventService.update).toHaveBeenCalledWith(1, updateEventDto);
    });

    it('should throw error if event not found', async () => {
      mockEventService.findOne.mockResolvedValue(null);

      await expect(controller.update(1, {})).rejects.toThrow('Event not found');
    });
  });

  describe('remove', () => {
    it('should remove an event', async () => {
      const existingEvent = new Event();
      existingEvent.id = 1;

      mockEventService.findOne.mockResolvedValue(existingEvent);
      mockEventService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);
      expect(result).toEqual({ message: 'Event deleted successfully' });
      expect(mockEventService.findOne).toHaveBeenCalledWith(1);
      expect(mockEventService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw error if event not found', async () => {
      mockEventService.findOne.mockResolvedValue(null);

      await expect(controller.remove(1)).rejects.toThrow('Event not found');
    });
  });

  describe('findByCategory', () => {
    it('should return events by category', async () => {
      const result: Event[] = [];
      mockEventService.findByCategory.mockResolvedValue(result);

      expect(await controller.findByCategory('conference')).toBe(result);
      expect(mockEventService.findByCategory).toHaveBeenCalledWith('conference');
    });
  });

  describe('findByStatus', () => {
    it('should return events by status', async () => {
      const result: Event[] = [];
      mockEventService.findByStatus.mockResolvedValue(result);

      expect(await controller.findByStatus('upcoming')).toBe(result);
      expect(mockEventService.findByStatus).toHaveBeenCalledWith('upcoming');
    });
  });

  describe('findUpcoming', () => {
    it('should return upcoming events', async () => {
      const result: Event[] = [];
      mockEventService.findUpcoming.mockResolvedValue(result);

      expect(await controller.findUpcoming()).toBe(result);
      expect(mockEventService.findUpcoming).toHaveBeenCalled();
    });
  });
});
