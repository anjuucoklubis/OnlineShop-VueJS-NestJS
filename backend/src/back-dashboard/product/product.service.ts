import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  findAllProducts() {
    return this.prisma.product.findMany({});
  }

  async findOneProduct(id?: number) {
    try {
      const productId = parseInt(id.toString(), 10);
      return await this.prisma.product.findFirst({
        where: {
          id: productId,
        },
      });
    } catch (error) {
      throw new Error('Error finding category product');
    }
  }

  // createProduct(data: Prisma.ProductCreateInput) {
  //   if (data.categoryproduct && data.categoryproduct.create) {
  //     return this.prisma.product.create({
  //       data: {
  //         name: data.name,
  //         desc: data.desc,
  //         price: data.price,
  //         quantity: data.quantity,
  //         image: data.image,
  //         categoryproduct: {
  //           create: data.categoryproduct.create,
  //         },
  //       },
  //       include: {
  //         categoryproduct: true,
  //       },
  //     });
  //   } else {
  //     console.error("Invalid categoryproduct data");
  //     throw new Error("Invalid categoryproduct data");
  //   }
  // }

  createProduct(product : Prisma.ProductCreateInput){
    product.categoryproduct.connect.id = +product.categoryproduct.connect.id;
    return this.prisma.product.create({
      data: product,
    })
  }
  
  
  async updateProduct(id: number, data: Prisma.ProductUpdateInput) {
    try {
      const productId = parseInt(id.toString(), 10);

      const updateData: Partial<Prisma.ProductUpdateInput> = {};
      if (data.name) {
        updateData.name = data.name;
      }
      if (data.image) {
        updateData.image = data.image;
      }
      if (Object.keys(updateData).length > 0) {
        return await this.prisma.product.update({
          where: {
            id: productId,
          },
          data: updateData,
        });
      } else {
        throw new Error('No valid data provided for update');
      }
    } catch (error) {
      throw new Error('Error updating category product');
    }
  }

  deleteProduct(id: number) {
    return this.prisma.product.delete({
      where: {
        id: id,
      },
    });
  }
  
}
