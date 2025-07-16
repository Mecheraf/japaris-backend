import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User | null> {
    const result = await this.userService.findOne(id);  
    return result;
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<User | null> {
    const result = await this.userService.findByEmail(email);
    return result;
  }

  @Post()
  async create(@Body() createUserDto: User): Promise<User> {
    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.isAdmin = createUserDto.isAdmin || false;
    user.isActive = createUserDto.isActive ?? true;
    user.nationality = createUserDto.nationality;
    return this.userService.create(user);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: Partial<User>): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    Object.assign(user, updateUserDto);
    user.updatedAt = new Date();
    
    return this.userService.update(id, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: { email: string }): Promise<void> {
    console.log(forgotPasswordDto.email);
    return this.userService.forgotPassword(forgotPasswordDto.email);
  }
}