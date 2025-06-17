import { Body, Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostponementHistoryService } from './postponement-history.service';
import { FindAllHistoryDto } from './dto';
import { CurrentUser } from 'src/shared';
import { IUser } from 'src/users/user.types';

@ApiBearerAuth('bearer')
@ApiTags('history')
@Controller('history')
export class PostponementHistoryController {
  constructor(private readonly historyService: PostponementHistoryService) {}

  @Get()
  async getAll(
    @Body() historyDto: FindAllHistoryDto,
    @CurrentUser() { _id }: IUser,
  ) {
    return await this.historyService.findAll(historyDto, _id);
  }
}
