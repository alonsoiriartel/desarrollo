import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
export type ProviderKey = 'memory' | 'mysql' | 'mongo';
export interface ItemView {
  id: string;
  nombre: string;
  cantidad: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface ItemsStore {
  list(): Promise<ItemView[]>;
  get(id: string): Promise<ItemView>;
  create(data: CreateItemDto): Promise<ItemView>;
  update(id: string, data: UpdateItemDto): Promise<ItemView>;
  remove(id: string): Promise<void>;
}
