import { Controller, UseGuards, Post, Req } from '@nestjs/common';
import { LocalAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() request: { user: unknown }) {
        return {usuario: request.user };
    }
}
