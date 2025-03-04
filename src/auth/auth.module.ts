import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { UsersModule } from 'src/users/user.module';
import { DatabaseModule } from 'src/database/database.module';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [JwtModule.register({}), UsersModule, DatabaseModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
