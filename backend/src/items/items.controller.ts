import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly service: ItemsService) {}

  @Get()
  list(@Headers('x-db-provider') db?: string) { return this.service.list(db); }

  @Get(':id')
  get(@Param('id') id: string, @Headers('x-db-provider') db?: string) {
    return this.service.get(id, db);
  }

  @Post()
  create(@Body() dto: CreateItemDto, @Headers('x-db-provider') db?: string) {
    return this.service.create(dto, db);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
    @Headers('x-db-provider') db?: string,
  ) { return this.service.update(id, dto, db); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Headers('x-db-provider') db?: string) {
    await this.service.remove(id, db);
  }
}
