// nest
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// controller
import { UsersController } from './user.controller';

// service
import { UsersService } from './user.service';

// schema
import User from './user.schema';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
