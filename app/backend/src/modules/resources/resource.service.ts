import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResourceDto } from 'src/user/dto/create-resource.dto';
import { UpdateResourceDto } from 'src/user/dto/update-resource.dto';

@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}

  // ADMIN - Create
  create(dto: CreateResourceDto) {
    return this.prisma.resource.create({ data: dto });
  }

  // PUBLIC - Get all resources (return ALL bookings)
  findAll() {
    return this.prisma.resource.findMany({
      include: {
        bookings: true, // return ALL bookings, do NOT filter
      },
    });
  }

  // PUBLIC - Get one resource (return ALL bookings)
  async findOne(id: number) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      include: {
        bookings: true, // return ALL bookings, do NOT filter
      },
    });

    if (!resource) throw new NotFoundException('Resource not found');
    return resource;
  }

  // ADMIN - Update
  async update(id: number, dto: UpdateResourceDto) {
    const exists = await this.prisma.resource.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Resource not found');

    return this.prisma.resource.update({
      where: { id },
      data: dto,
    });
  }

  // ADMIN - Delete
  async delete(id: number) {
    const exists = await this.prisma.resource.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Resource not found');

    await this.prisma.resource.delete({ where: { id } });
    return { message: 'Resource deleted successfully' };
  }

  // ADMIN - Get all resources with bookings
  getAllResources() {
    return this.prisma.resource.findMany({
      include: { bookings: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
