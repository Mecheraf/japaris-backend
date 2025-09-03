import { Controller, Post, Body, Get, Param, Put, Delete, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from './event.entity';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async findAll(): Promise<Event[]> {
    return this.eventService.findAll();
  }

  @Get('upcoming')
  async findUpcoming(): Promise<Event[]> {
    return this.eventService.findUpcoming();
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: string): Promise<Event[]> {
    return this.eventService.findByCategory(category);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string): Promise<Event[]> {
    return this.eventService.findByStatus(status);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Event | null> {
    return this.eventService.findOne(id);
  }

  @Post()
  async create(@Body() createEventDto: Event): Promise<Event> {
    const event = new Event();
    event.title = createEventDto.title;
    event.description = createEventDto.description;
    event.location = createEventDto.location;
    event.place = createEventDto.place;
    event.startDate = createEventDto.startDate;
    event.endDate = createEventDto.endDate;
    event.organizer = createEventDto.organizer;
    event.category = createEventDto.category;
    event.status = createEventDto.status || 'upcoming';
    event.price = createEventDto.price || 0;
    event.maxAttendees = createEventDto.maxAttendees || 0;
    event.currentAttendees = createEventDto.currentAttendees || 0;
    event.contactEmail = createEventDto.contactEmail;
    event.link = createEventDto.link;
    
    return this.eventService.create(event);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateEventDto: Partial<Event>): Promise<Event> {
    const event = await this.eventService.findOne(id);
    if (!event) {
      throw new Error('Event not found');
    }
    
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    const event = await this.eventService.findOne(id);
    if (!event) {
      throw new Error('Event not found');
    }
    
    await this.eventService.remove(id);
    return { message: 'Event deleted successfully' };
  }
}
