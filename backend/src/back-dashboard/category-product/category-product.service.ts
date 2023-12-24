import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
 
@Injectable()
export class CategoryProductService {
    constructor(private prisma: PrismaService){}

    findAllCategoryProducts() {
        return this.prisma.categoryProduct.findMany({});
      }
    
      async findOneCategoryProduct(id?: number) {
        try {
          const categoryId = parseInt(id.toString(), 10); 
          return await this.prisma.categoryProduct.findFirst({
            where: {
              id: categoryId,
            },
          });
        } catch (error) {
          throw new Error('Error finding category product');
        }
      }
      
    
      createCategoryProduct(data: Prisma.CategoryProductCreateInput) {
        return this.prisma.categoryProduct.create({
          data: {
            name: data.name,
            image: data.image,
          } 
        });
      }
      
      async updateCategoryProduct(id: number, data: Prisma.CategoryProductUpdateInput) {
        try {
          const categoryId = parseInt(id.toString(), 10); 
          
          const updateData: Partial<Prisma.CategoryProductUpdateInput> = {};
          if (data.name) {
            updateData.name = data.name;
          }
          if (data.image) {
            updateData.image = data.image;
          }      
          if (Object.keys(updateData).length > 0) {
            return await this.prisma.categoryProduct.update({
              where: {
                id: categoryId,
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
      
      
    
      deleteCategoryProduct(id: number) {
        return this.prisma.categoryProduct.delete({
          where: {
            id: id,
          },
        });
      }
  }

