import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Role } from '../auth/roles.decorator';
import { CreateResourceDto } from 'src/user/dto/create-resource.dto';

@Controller('resources')
export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  // 🔥 Only ADMIN can create resources
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('ADMIN')
  create(@Body() dto: CreateResourceDto) {
    return this.resourceService.createResource(dto);
  }

  // 🟢 Anyone (student/staff/admin) can view resources
  @Get()
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.resourceService.getAllResources();
  }
}
