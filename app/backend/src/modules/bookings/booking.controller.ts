import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CreateBookingDto } from 'src/user/dto/create-booking.dto';
import { AdminGuard } from '../auth/role.guard';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // USER: Create Booking
  @UseGuards(JwtAuthGuard)
  @Post()
  createBooking(@Body() dto: CreateBookingDto, @Req() req: any) {
    const userId = req.user.id; // ✅ FIXED
    return this.bookingService.createBooking(userId, dto);
  }

  // USER: My Bookings
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyBookings(@Req() req: any) {
    const userId = req.user.id; // ✅ FIXED
    return this.bookingService.getMyBookings(userId);
  }

  // ADMIN: Pending bookings
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('pending')
  getPending() {
    return this.bookingService.getPendingBookings();
  }

  // ADMIN: Approve
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.bookingService.approveBooking(Number(id));
  }

  // ADMIN: Reject
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.bookingService.rejectBooking(Number(id));
  }

  // ADMIN: All bookings
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  getAllBookings() {
    return this.bookingService.getAllBookings();
  }
}
