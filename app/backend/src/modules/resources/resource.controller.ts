import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { ResourceService } from './resource.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/role.guard';
import { CreateResourceDto } from 'src/user/dto/create-resource.dto';
import { UpdateResourceDto } from 'src/user/dto/update-resource.dto';

@Controller('resources')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  // ---------------------- ADMIN ONLY ----------------------

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() dto: CreateResourceDto) {
    return this.resourceService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateResourceDto,
  ) {
    return this.resourceService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.resourceService.delete(id);
  }

  // ---------------------- PUBLIC --------------------------
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.resourceService.findAll();
  }

  // ---------------------- ADMIN ONLY VIEW ------------------
  // NOTE: must be placed BEFORE the ':id' route so "admin" is not treated as an id
  @Get('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  getAllResources() {
    return this.resourceService.getAllResources();
  }

  // ---------------------- PUBLIC (single) -----------------
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.resourceService.findOne(id);
  }
}
