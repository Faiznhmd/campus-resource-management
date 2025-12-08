// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { CreateResourceDto } from 'src/user/dto/create-resource.dto';
// import { UpdateResourceDto } from 'src/user/dto/update-resource.dto';

// @Injectable()
// export class ResourceService {
//   constructor(private prisma: PrismaService) {}

//   createResource(dto: CreateResourceDto) {
//     return this.prisma.resource.create({
//       data: {
//         ...dto,
//       },
//     });
//   }

//   // GET SINGLE RESOURCE
//   async getResourceById(id: number) {
//     const resource = await this.prisma.resource.findUnique({
//       where: { id },
//     });

//     if (!resource) throw new NotFoundException('Resource not found');

//     return resource;
//   }

//   // UPDATE RESOURCE (ADMIN)
//   async updateResource(id: number, dto: UpdateResourceDto) {
//     const resource = await this.prisma.resource.findUnique({
//       where: { id },
//     });

//     if (!resource) throw new NotFoundException('Resource not found');

//     return this.prisma.resource.update({
//       where: { id },
//       data: dto,
//     });
//   }

//   // DELETE RESOURCE (ADMIN)
//   async deleteResource(id: number) {
//     const resource = await this.prisma.resource.findUnique({
//       where: { id },
//     });

//     if (!resource) throw new NotFoundException('Resource not found');

//     await this.prisma.resource.delete({
//       where: { id },
//     });

//     return { message: 'Resource deleted successfully' };
//   }

//   //all resources
//   getAllResources() {
//     return this.prisma.resource.findMany();
//   }
// }

// src/modules/resource/resource.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResourceDto } from 'src/user/dto/create-resource.dto';
import { UpdateResourceDto } from 'src/user/dto/update-resource.dto';

@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}

  // 🔥 ADMIN - Create Resource
  create(dto: CreateResourceDto) {
    return this.prisma.resource.create({
      data: dto,
    });
  }

  // 🟢 Public: Get all resources
  findAll() {
    return this.prisma.resource.findMany({
      include: {
        bookings: true,
      },
    });
  }

  // 🟢 Public: Get one resource
  async findOne(id: number) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      include: {
        bookings: true,
      },
    });

    if (!resource) throw new NotFoundException('Resource not found');

    return resource;
  }

  // 🔥 ADMIN - Update Resource
  async update(id: number, dto: UpdateResourceDto) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) throw new NotFoundException('Resource not found');

    return this.prisma.resource.update({
      where: { id },
      data: dto,
    });
  }

  // 🔥 ADMIN - Delete Resource
  async delete(id: number) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) throw new NotFoundException('Resource not found');

    await this.prisma.resource.delete({
      where: { id },
    });

    return { message: 'Resource deleted successfully' };
  }

  async getAllResources() {
    return this.prisma.resource.findMany({
      include: {
        bookings: true, // optional: show bookings for each resource
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
