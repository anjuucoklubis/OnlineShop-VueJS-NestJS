import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryProductModule } from './back-dashboard/category-product/category-product.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './back-dashboard/product/product.module';

@Module({
  imports: [PrismaModule,CategoryProductModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
