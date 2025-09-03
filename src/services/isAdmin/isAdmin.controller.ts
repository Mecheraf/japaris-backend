import { Controller, Get, Param } from '@nestjs/common';
import { IsAdminService } from './isAdmin.service';

@Controller('isAdmin')
export class IsAdminController {
  constructor(private readonly isAdminService: IsAdminService) {}

  @Get(':id')
  async isAdmin(@Param('id') id: number) {
    return this.isAdminService.isAdmin(id);
  }
}