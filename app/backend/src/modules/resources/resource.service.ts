import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResourceDto } from 'src/user/dto/create-resource.dto';

@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}

  createResource(dto: CreateResourceDto) {
    return this.prisma.resource.create({
      data: {
        name: dto.name,
        type: dto.type,
        location: dto.location,
      },
    });
  }

  getAllResources() {
    return this.prisma.resource.findMany();
  }
}
