// import {
//   Post,
//   Controller,
//   Get,
//   Param,
//   Patch,
//   Delete,
//   UseGuards,
//   Body,
//   ParseIntPipe,
// } from '@nestjs/common';
// import { ResourceService } from './resource.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { AdminGuard } from '../auth/role.guard';
// import { Role } from '../auth/roles.decorator';
// import { CreateResourceDto } from 'src/user/dto/create-resource.dto';
// import { UpdateResourceDto } from 'src/user/dto/update-resource.dto';

// @Controller('resources')
// export class ResourceController {
//   constructor(private resourceService: ResourceService) {}

//   // 🔥 Only ADMIN can create resources
//   @Post()
//   @UseGuards(JwtAuthGuard, AdminGuard)
//   @Role('ADMIN')
//   create(@Body() dto: CreateResourceDto) {
//     return this.resourceService.createResource(dto);
//   }

//   // 🟢 Anyone (student/staff/admin) can view resources
//   @Get()
//   @UseGuards(JwtAuthGuard)
//   getAll() {
//     return this.resourceService.getAllResources();
//   }

//   // GET SINGLE RESOURCE
//   @Get(':id')
//   async getSingle(@Param('id', ParseIntPipe) id: number) {
//     return this.resourceService.getResourceById(id);
//   }

//   // UPDATE RESOURCE (ADMIN ONLY)
//   @Patch(':id')
//   @UseGuards(JwtAuthGuard, AdminGuard)
//   async update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() dto: UpdateResourceDto,
//   ) {
//     return this.resourceService.updateResource(id, dto);
//   }

//   // DELETE RESOURCE (ADMIN ONLY)
//   @Delete(':id')
//   @UseGuards(JwtAuthGuard, AdminGuard)
//   async delete(@Param('id', ParseIntPipe) id: number) {
//     return this.resourceService.deleteResource(id);
//   }
// }

// src/modules/resource/resource.controller.ts

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
  constructor(private service: ResourceService) {}

  // ---------------------- ADMIN ONLY ----------------------

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() dto: CreateResourceDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateResourceDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  // ---------------------- PUBLIC --------------------------

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
