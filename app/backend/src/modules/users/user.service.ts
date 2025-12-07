import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../../user/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // already existing:
  // findAll() { ... }

  async updateUser(userId: number, dto: UpdateUserDto) {
    const data: any = { ...dto };

    // if password is being updated, hash it
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}
