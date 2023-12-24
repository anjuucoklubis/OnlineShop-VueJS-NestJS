import { Global, Module } from '@nestjs/common';
import { CategoryProductService } from './category-product.service';
import { CategoryProductController } from './category-product.controller';

@Global()
@Module({
  providers: [CategoryProductService],
  controllers: [CategoryProductController],
  exports: [CategoryProductService]
})
export class CategoryProductModule {}
