import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  /**
   * Retrieves all events from the database
   * @returns Promise containing array of all events
   */
  async findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  /**
   * Finds a single event by its ID
   * @param id The event's ID
   * @returns Promise containing the found event or null if not found
   */
  async findOne(id: number): Promise<Event | null> {
    return this.eventRepository.findOne({ where: { id } });
  }

  /**
   * Creates a new event in the database
   * @param event The event object to create
   * @returns Promise containing the created event
   */
  async create(event: Event): Promise<Event> {
    event.createdAt = new Date();
    event.updatedAt = new Date();
    return this.eventRepository.save(event);
  }

  /**
   * Updates an existing event in the database
   * @param id The ID of the event to update
   * @param updateEventDto Partial event object with fields to update
   * @returns Promise containing the updated event
   */
  async update(id: number, updateEventDto: Partial<Event>): Promise<Event> {
    updateEventDto.updatedAt = new Date();
    await this.eventRepository.update(id, updateEventDto);
    const updatedEvent = await this.findOne(id);
    if (!updatedEvent) {
      throw new Error('Event not found after update');
    }
    return updatedEvent;
  }

  /**
   * Removes an event from the database
   * @param id The ID of the event to remove
   * @returns Promise that resolves when the event is deleted
   */
  async remove(id: number): Promise<void> {
    await this.eventRepository.delete(id);
  }

  /**
   * Finds events by category
   * @param category The category to search for
   * @returns Promise containing array of events in the specified category
   */
  async findByCategory(category: string): Promise<Event[]> {
    return this.eventRepository.find({ where: { category } });
  }

  /**
   * Finds events by status
   * @param status The status to search for
   * @returns Promise containing array of events with the specified status
   */
  async findByStatus(status: string): Promise<Event[]> {
    return this.eventRepository.find({ where: { status } });
  }

  /**
   * Finds upcoming events
   * @returns Promise containing array of upcoming events
   */
  async findUpcoming(): Promise<Event[]> {
    const now = new Date();
    return this.eventRepository
      .createQueryBuilder('event')
      .where('event.startDate > :now', { now })
      .andWhere('event.status = :status', { status: 'upcoming' })
      .orderBy('event.startDate', 'ASC')
      .getMany();
  }
}


