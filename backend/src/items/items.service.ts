import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { MemoryItemsStore } from './stores/memory-items.store';
import { MysqlItemsStore } from './stores/mysql-items.store';
import { MongoItemsStore } from './stores/mongo-items.store';
import { ItemsStore } from './items.types';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly memory: MemoryItemsStore,
  ) {}

  private store(provider?: string): ItemsStore {
    const name = (provider || 'memory').toLowerCase();
    const enabled = (process.env.ENABLED_DATABASES || 'memory')
      .split(',').map(x => x.trim().toLowerCase());
    if (!['memory', 'mysql', 'mongo'].includes(name)) {
      throw new BadRequestException('X-DB-Provider: memory, mysql o mongo');
    }
    if (!enabled.includes(name)) {
      throw new ServiceUnavailableException(`Motor ${name} no habilitado en backend/.env`);
    }
    if (name === 'memory') return this.memory;
    if (name === 'mysql') return this.moduleRef.get(MysqlItemsStore, { strict: false });
    return this.moduleRef.get(MongoItemsStore, { strict: false });
  }
  list(provider?: string) { return this.store(provider).list(); }
  get(id: string, provider?: string) { return this.store(provider).get(id); }
  create(data: CreateItemDto, provider?: string) { return this.store(provider).create(data); }
  update(id: string, data: UpdateItemDto, provider?: string) {
    return this.store(provider).update(id, data);
  }
  remove(id: string, provider?: string) { return this.store(provider).remove(id); }
}
