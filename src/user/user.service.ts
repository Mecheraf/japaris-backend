import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { MailService } from '../services/mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailService,
  ) {}

  /**
   * Retrieves all users from the database
   * @returns Promise containing array of all users
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Finds a single user by their ID
   * @param id The user's ID
   * @returns Promise containing the found user or null if not found
   */
  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * Creates a new user in the database
   * @param user The user object to create
   * @returns Promise containing the created user
   */
  async create(user: User): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10);
    const createdUser = await this.userRepository.save(user);
    const subject = 'Welcome to Japaris '+user.name+' !';
    const link = 'http://localhost:3000/user/confirm-email?id='+user.id+'&email='+user.email;
    const body = 'Welcome to Japaris! Your account has been created. Please confirm your email address to activate your account.\n\n' + link + '\n\nThank you for joining Japaris!';
    await this.mailService.sendMail(createdUser.email, subject, body);
    return createdUser;
  }

  /**
   * Updates an existing user in the database
   * @param id The ID of the user to update
   * @param user The updated user object
   * @returns Promise containing the updated user
   */
  async update(id: number, user: User): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10);
    return this.userRepository.save(user);
  }

  /**
   * Removes a user from the database
   * @param id The ID of the user to remove
   */
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  /**
   * Handles forgot password functionality by sending reset email
   * @param email The email of the user requesting password reset
   * @throws Error if user not found
   */
  async forgotPassword(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    await this.mailService.sendMail(user.email, 'Forgot Password', `Your password reset token is ${user.password}`);
  }

  /**
   * Finds a user by their email address
   * @param email The email to search for
   * @returns Promise containing the found user or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Confirms a user's email address
   * @param id The user's ID
   * @param email The email to confirm
   * @throws Error if user not found or ID doesn't match
   */
  async confirmEmail(id: number, email: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    } else {
      if(user.id === id && !user.isActive) {
        await this.userRepository.update(id, { isActive: true }).then(() => {
          this.mailService.sendMail(user.email, 'Email Confirmed', `Your email has been confirmed`);
        });
      } else {
        if(user.isActive) {
          throw new Error('User already confirmed');
        } else {
          throw new Error('User ID does not match');
        }
      }
    }
  }
}