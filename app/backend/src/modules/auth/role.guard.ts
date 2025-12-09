import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// ===============================
// 1) DYNAMIC ROLES GUARD
// ===============================
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );

    // If no role defined → allow
    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    return user.role === requiredRole;
  }
}

// ===============================
// 2) ADMIN-ONLY GUARD
// ===============================
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) throw new ForbiddenException('Not authenticated');

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied: Admins only');
    }
    return true;
  }
}
