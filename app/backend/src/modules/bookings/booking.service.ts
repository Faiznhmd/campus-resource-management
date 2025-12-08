import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from 'src/user/dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  // ⭐ Converts "4pm" → Date
  private convertFriendlyTimeToDate(timeString: string): Date {
    const today = new Date();
    const match = timeString.match(/^(\d{1,2})(am|pm)$/i);

    if (!match) {
      throw new BadRequestException(
        'Invalid time format. Use "4pm" or "10am".',
      );
    }

    let hour = parseInt(match[1], 10);
    const period = match[2].toLowerCase();

    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;

    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hour,
      0,
      0,
      0,
    );
  }

  // ⭐ Create booking (supports both Phase 1 + Phase 2)
  async createBooking(userId: number, dto: CreateBookingDto) {
    const { resourceId, startTime, endTime } = dto;

    const start = this.convertFriendlyTimeToDate(startTime);
    const end = this.convertFriendlyTimeToDate(endTime);

    if (start >= end) {
      throw new BadRequestException('startTime must be before endTime');
    }

    // 1️⃣ Find Resource
    const resource = await this.prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) throw new NotFoundException('Resource not found');

    // 2️⃣ Check resource availability
    if (resource.status !== 'AVAILABLE') {
      throw new BadRequestException('Resource not available for booking');
    }

    // 3️⃣ Duration limit
    if (resource.maxDuration) {
      const diffHours = (end.getTime() - start.getTime()) / 3600000;
      if (diffHours > resource.maxDuration) {
        throw new BadRequestException(
          `Duration exceeds max limit of ${resource.maxDuration} hours`,
        );
      }
    }

    // 4️⃣ Check time slot overlap (only approved bookings block the slot)
    const overlapping = await this.prisma.booking.findFirst({
      where: {
        resourceId,
        status: 'APPROVED',
        AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
      },
    });

    if (overlapping) {
      throw new BadRequestException('Resource already booked for this time');
    }

    // ⭐⭐ Main Logic ⭐⭐

    // Phase 2 → requiresApproval = true → Booking goes to PENDING
    if (resource.requiresApproval) {
      const booking = await this.prisma.booking.create({
        data: {
          userId,
          resourceId,
          startTime: start,
          endTime: end,
          status: 'PENDING',
        },
      });

      return {
        message: 'Booking request sent. Awaiting admin approval.',
        booking,
      };
    }

    // Phase 1 → Auto-approve booking
    const [booking] = await this.prisma.$transaction([
      this.prisma.booking.create({
        data: {
          userId,
          resourceId,
          startTime: start,
          endTime: end,
          status: 'APPROVED',
        },
      }),
      this.prisma.resource.update({
        where: { id: resourceId },
        data: { status: 'BOOKED' },
      }),
    ]);

    return {
      message: 'Booking successful!',
      booking,
    };
  }

  // ⭐ Admin: Get all PENDING bookings
  getPendingBookings() {
    return this.prisma.booking.findMany({
      where: { status: 'PENDING' },
      include: { resource: true, user: true },
    });
  }

  // ⭐ Admin: Approve booking
  async approveBooking(id: number) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'PENDING')
      throw new BadRequestException('Only PENDING bookings can be approved');

    return this.prisma.$transaction([
      this.prisma.booking.update({
        where: { id },
        data: { status: 'APPROVED' },
      }),
      this.prisma.resource.update({
        where: { id: booking.resourceId },
        data: { status: 'BOOKED' },
      }),
    ]);
  }

  // ⭐ Admin: Reject booking
  async rejectBooking(id: number) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'PENDING')
      throw new BadRequestException('Only PENDING bookings can be rejected');

    return this.prisma.booking.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }

  // ⭐ Admin: Get ALL bookings
  getAllBookings() {
    return this.prisma.booking.findMany({
      include: {
        user: true,
        resource: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // ⭐ User: My bookings
  getMyBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { resource: true },
      orderBy: { startTime: 'desc' },
    });
  }
}
