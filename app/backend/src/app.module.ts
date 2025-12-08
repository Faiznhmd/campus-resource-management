import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ResourceModule } from './modules/resources/resource.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './modules/users/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './modules/bookings/booking.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ResourceModule,
    UsersModule,
    BookingModule,
  ],
  controllers: [AppController], // ← add this
  providers: [PrismaService, AppService],
})
export class AppModule {}
