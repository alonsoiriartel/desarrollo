import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from './items/items.module';
import { HealthController } from './health/health.controller';
import { MysqlItemEntity } from './items/entities/mysql-item.entity';

// Se lee .env ANTES de construir los módulos de NestJS.
// Etapa 1: memory; etapa 2: memory,mysql; etapa 3: memory,mysql,mongo.
const enabled = (process.env.ENABLED_DATABASES || 'memory')
  .split(',').map(x => x.trim().toLowerCase()).filter(Boolean);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ...(enabled.includes('mysql') ? [TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.getOrThrow<string>('MYSQL_HOST'),
        port: Number(config.getOrThrow<string>('MYSQL_PORT')),
        username: config.getOrThrow<string>('MYSQL_USER'),
        password: config.getOrThrow<string>('MYSQL_PASSWORD'),
        database: config.getOrThrow<string>('MYSQL_DATABASE'),
        entities: [MysqlItemEntity],
        synchronize: config.get<string>('MYSQL_SYNCHRONIZE') === 'true',
        retryAttempts: 2,
      }),
    })] : []),
    ...(enabled.includes('mongo') ? [MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
        retryAttempts: 2,
      }),
    })] : []),
    ItemsModule.register(enabled),
  ],
  controllers: [HealthController],
})
export class AppModule {}
