import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { MysqlItemEntity } from '../entities/mysql-item.entity';
import { ItemsStore, ItemView } from '../items.types';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';

@Injectable()
export class MysqlItemsStore implements ItemsStore {
  constructor(
    @InjectRepository(MysqlItemEntity)
    private readonly sql: Repository<MysqlItemEntity>,
  ) {}

  private view(row: MysqlItemEntity): ItemView {
    return {
      id: row.id,
      nombre: row.nombre,
      cantidad: row.cantidad,
      activo: Boolean(row.activo),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async list(): Promise<ItemView[]> {
    return (await this.sql.find({ order: { createdAt: 'DESC' } }))
      .map((row) => this.view(row));
  }

  async get(id: string): Promise<ItemView> {
    const row = await this.sql.findOneBy({ id });
    if (!row) throw new NotFoundException('Registro no encontrado en MySQL');
    return this.view(row);
  }

  async create(data: CreateItemDto): Promise<ItemView> {
    const row = this.sql.create({ id: randomUUID(), ...data });
    return this.view(await this.sql.save(row));
  }

  async update(id: string, data: UpdateItemDto): Promise<ItemView> {
    const row = await this.sql.findOneBy({ id });
    if (!row) throw new NotFoundException('Registro no encontrado en MySQL');
    Object.assign(row, data);
    return this.view(await this.sql.save(row));
  }

  async remove(id: string): Promise<void> {
    const result = await this.sql.delete({ id });
    if (!result.affected) throw new NotFoundException('Registro no encontrado en MySQL');
  }
}
