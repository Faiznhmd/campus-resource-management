import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ResourceModule } from './modules/resources/resource.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './modules/users/user.module';

@Module({
  imports: [PrismaModule, AuthModule, ResourceModule, UsersModule],
  providers: [PrismaService],
})
export class AppModule {}
