import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [PassportModule],
  providers: [JwtAuthGuard, LocalAuthGuard, RolesGuard],
  exports: [JwtAuthGuard, LocalAuthGuard, RolesGuard],
})
export class SecurityModule {}
