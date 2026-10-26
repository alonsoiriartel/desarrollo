import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { MemoryItemsStore } from './stores/memory-items.store';
import { MysqlItemsStore } from './stores/mysql-items.store';
import { MongoItemsStore } from './stores/mongo-items.store';
import { MysqlItemEntity } from './entities/mysql-item.entity';
import { MongoItem, MongoItemSchema } from './schemas/mongo-item.schema';

@Module({})
export class ItemsModule {
  static register(enabled: string[]): DynamicModule {
    return {
      module: ItemsModule,
      imports: [
        ...(enabled.includes('mysql') ? [TypeOrmModule.forFeature([MysqlItemEntity])] : []),
        ...(enabled.includes('mongo') ? [MongooseModule.forFeature([
          { name: MongoItem.name, schema: MongoItemSchema },
        ])] : []),
      ],
      controllers: [ItemsController],
      providers: [
        ItemsService, MemoryItemsStore,
        ...(enabled.includes('mysql') ? [MysqlItemsStore] : []),
        ...(enabled.includes('mongo') ? [MongoItemsStore] : []),
      ],
    };
  }
}
