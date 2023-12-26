import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryProductController } from './back-dashboard/category-product/category-product.controller';
import { CategoryProductModule } from './back-dashboard/category-product/category-product.module';
import { PrismaService } from './prisma/prisma.service';
import { CategoryProductService } from './back-dashboard/category-product/category-product.service';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [PrismaModule,CategoryProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
