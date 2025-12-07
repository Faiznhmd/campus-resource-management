import { Module } from '@nestjs/common';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ResourceController],
  providers: [ResourceService, PrismaService],
})
export class ResourceModule {}
