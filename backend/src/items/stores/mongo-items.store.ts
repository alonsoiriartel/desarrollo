import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { MongoItem } from '../schemas/mongo-item.schema';
import { ItemsStore, ItemView } from '../items.types';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';

@Injectable()
export class MongoItemsStore implements ItemsStore {
  constructor(
    @InjectModel(MongoItem.name)
    private readonly mongo: Model<MongoItem>,
  ) {}

  private view(doc: MongoItem): ItemView {
    return {
      id: doc._id,
      nombre: doc.nombre,
      cantidad: doc.cantidad,
      activo: doc.activo,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }

  async list(): Promise<ItemView[]> {
    const docs = await this.mongo.find().sort({ createdAt: -1 }).exec();
    return docs.map((doc) => this.view(doc));
  }

  async get(id: string): Promise<ItemView> {
    const doc = await this.mongo.findById(id).exec();
    if (!doc) throw new NotFoundException('Registro no encontrado en MongoDB');
    return this.view(doc);
  }

  async create(data: CreateItemDto): Promise<ItemView> {
    const doc = await this.mongo.create({ _id: randomUUID(), ...data });
    return this.view(doc);
  }

  async update(id: string, data: UpdateItemDto): Promise<ItemView> {
    const doc = await this.mongo.findByIdAndUpdate(id, { $set: data }, {
      new: true,
      runValidators: true,
    }).exec();
    if (!doc) throw new NotFoundException('Registro no encontrado en MongoDB');
    return this.view(doc);
  }

  async remove(id: string): Promise<void> {
    const doc = await this.mongo.findByIdAndDelete(id).exec();
    if (!doc) throw new NotFoundException('Registro no encontrado en MongoDB');
  }
}
