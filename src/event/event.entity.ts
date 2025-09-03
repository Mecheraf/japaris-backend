import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  location: string;

  @Column()
  place: string; // "bar", "club", "street", "house", "other"

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  organizer: string;

  @Column()
  category: string; // 'conference', 'workshop', 'networking', 'seminar', 'other'

  @Column()
  status: string; // 'upcoming', 'ongoing', 'completed', 'cancelled'

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ default: 0 })
  maxAttendees: number;

  @Column({ default: 0 })
  currentAttendees: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  contactEmail: string;

  @Column({ nullable: true })
  link: string;
}
