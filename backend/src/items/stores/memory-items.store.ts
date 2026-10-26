import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ItemsStore, ItemView } from '../items.types';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';

// Etapa 1: misma API que MySQL/MongoDB, pero los datos están en RAM.
@Injectable()
export class MemoryItemsStore implements ItemsStore {
  private readonly records = new Map<string, ItemView>();

  async list(): Promise<ItemView[]> {
    return [...this.records.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  async get(id: string): Promise<ItemView> {
    const item = this.records.get(id);
    if (!item) throw new NotFoundException('Registro no encontrado en memoria');
    return item;
  }
  async create(data: CreateItemDto): Promise<ItemView> {
    const now = new Date().toISOString();
    const item = { ...data, id: randomUUID(), createdAt: now, updatedAt: now };
    this.records.set(item.id, item);
    return item;
  }
  async update(id: string, data: UpdateItemDto): Promise<ItemView> {
    const item = await this.get(id);
    const updated = { ...item, ...data, updatedAt: new Date().toISOString() };
    this.records.set(id, updated);
    return updated;
  }
  async remove(id: string): Promise<void> {
    if (!this.records.delete(id)) throw new NotFoundException('Registro no encontrado en memoria');
  }
}
