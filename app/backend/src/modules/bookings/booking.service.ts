import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from 'src/user/dto/create-booking.dto';
import { BookingStatus, ResourceStatus } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  /* ------------------------------------------------------------
     Convert friendly time → Date (Today)
  ------------------------------------------------------------ */
  private convertFriendlyTimeToDate(timeString: string): Date {
    const s = timeString.replace(/\s+/g, '').toLowerCase();

    const match = s.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/);
    if (!match) {
      throw new BadRequestException(
        'Invalid time format. Use "3pm" or "3:30pm".',
      );
    }

    let hour = parseInt(match[1], 10);
    const minute = match[2] ? parseInt(match[2], 10) : 0;
    const period = match[3];

    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;

    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      0,
    );
  }

  /* ------------------------------------------------------------
     AUTO RELEASE EXPIRED BOOKINGS
  ------------------------------------------------------------ */
  async releasePastBookings() {
    const now = new Date();

    const finished = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.APPROVED,
        endTime: { lt: now },
      },
    });

    if (finished.length === 0) return;

    const bookingIds = finished.map((b) => b.id);
    const resourceIds = Array.from(new Set(finished.map((b) => b.resourceId)));

    // Mark as COMPLETED
    await this.prisma.booking.updateMany({
      where: { id: { in: bookingIds } },
      data: { status: BookingStatus.COMPLETED },
    });

    // Make resources AVAILABLE again
    await this.prisma.resource.updateMany({
      where: { id: { in: resourceIds } },
      data: { status: 'AVAILABLE' },
    });
  }

  /* ------------------------------------------------------------
     CREATE BOOKING
  ------------------------------------------------------------ */
  async createBooking(userId: number, dto: CreateBookingDto) {
    await this.releasePastBookings();

    const { resourceId, startTime: startStr, endTime: endStr } = dto;

    const start = this.convertFriendlyTimeToDate(startStr);
    const end = this.convertFriendlyTimeToDate(endStr);

    if (start >= end) {
      throw new BadRequestException('startTime must be before endTime');
    }

    const resource = await this.prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) throw new NotFoundException('Resource not found');

    if (resource.status !== ResourceStatus.AVAILABLE) {
      throw new BadRequestException('This resource is currently unavailable');
    }

    const diffHours = (end.getTime() - start.getTime()) / 3600000;
    if (resource.maxDuration && diffHours > resource.maxDuration) {
      throw new BadRequestException(
        `Duration cannot exceed ${resource.maxDuration} hour(s).`,
      );
    }

    // Check overlapping bookings
    const overlapping = await this.prisma.booking.findFirst({
      where: {
        resourceId,
        status: { in: [BookingStatus.PENDING, BookingStatus.APPROVED] },
        AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
      },
    });

    if (overlapping) {
      throw new BadRequestException(
        `This resource is reserved between ${overlapping.startTime.toLocaleTimeString(
          [],
          { hour: '2-digit', minute: '2-digit' },
        )} and ${overlapping.endTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}.`,
      );
    }

    const status = resource.requiresApproval
      ? BookingStatus.PENDING
      : BookingStatus.APPROVED;

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        resourceId,
        startTime: start,
        endTime: end,
        status,
      },
    });

    return {
      message:
        status === BookingStatus.PENDING
          ? 'Booking request submitted. Awaiting admin approval.'
          : 'Booking confirmed successfully!',
      booking,
    };
  }

  /* ------------------------------------------------------------
     GET BOOKINGS BY RESOURCE
  ------------------------------------------------------------ */
  async getBookingsByResource(resourceId: number) {
    if (!resourceId) throw new BadRequestException('Invalid resourceId');

    return this.prisma.booking.findMany({
      where: { resourceId },
      orderBy: { startTime: 'asc' },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
      },
    });
  }

  /* ------------------------------------------------------------
     MY BOOKINGS
  ------------------------------------------------------------ */
  getMyBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { resource: true },
      orderBy: { startTime: 'desc' },
    });
  }

  /* ------------------------------------------------------------
     ADMIN — ALL BOOKINGS
  ------------------------------------------------------------ */
  getAllBookings() {
    return this.prisma.booking.findMany({
      include: { user: true, resource: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  getPendingBookings() {
    return this.prisma.booking.findMany({
      where: { status: BookingStatus.PENDING },
      include: { user: true, resource: true },
    });
  }

  async approveBooking(id: number) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Only PENDING bookings can be approved');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.APPROVED },
    });
  }

  async rejectBooking(id: number) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Only PENDING bookings can be rejected');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.REJECTED },
    });
  }

  async getBookingById(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { user: true, resource: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    return booking;
  }
}
