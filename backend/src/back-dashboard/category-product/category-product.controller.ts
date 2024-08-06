import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryProductService } from './category-product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageUploadCategory } from 'src/utils/storage-upload';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { existsSync, unlinkSync } from 'fs';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Category Product')
@Controller('category-product')
export class CategoryProductController {
  constructor(private categoryProductService: CategoryProductService) {}

  @Get('read-all')
  async getAllCategoryProduct(@Res() response: Response) {
    try {
      const data = await this.categoryProductService.findAllCategoryProducts();
      const responseData = data.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      const responseObject = {
        'INFORMATION-RESPONSE': {
          REQUESTNAME: 'READ CATEGORY PRODUCT ALL',
          METHOD: 'GET',
          'STATUS-RESPONSE': HttpStatus.OK,
          url: 'http://127.0.0.1:3000/category-product/real-all/',
        },
        'RESPONSE-DATA': responseData,
      };

      return response.status(HttpStatus.OK).json(responseObject);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('read-by-id/:id')
  async getOneCategoryProduct(@Param('id') id: number) {
    const result =
      await this.categoryProductService.findOneCategoryProduct(+id);
    try {
      const response = {
        'INFORMATION-RESPONSE': {
          REQUESTNAME: 'READ CATEGORY PRODUCT BY ID',
          METHOD: 'GET',
          'STATUS-RESPONSE': HttpStatus.OK,
          url: `http://127.0.0.1:3000/category-product/read-by-id/${id}`,
        },
        'RESPONSE-DATA': {
          id: result.id,
          name: result.name,
          image: result.image,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        },
      };
      return response;
    } catch {
      const responsee = {
        'INFORMATION-RESPONSE': {
          REQUESTNAME: 'READ CATEGORY PRODUCT BY ID',
          METHOD: 'GET',
          'STATUS-RESPONSE': HttpStatus.OK,
          url: `http://127.0.0.1:3000/category-product/read-by-id/${id}`,
        },
        'RESPONSE-DATA': {
          MESSAGE: `CATEGORY PRODUCT ID '${id}' NOT FOUND`,
        },
      };
      return responsee;
    }
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('image', StorageUploadCategory))
  async addCategoryProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Prisma.CategoryProductCreateInput,
  ) {
    try {
      if (!file || !file.filename) {
        throw new Error('No image file uploaded');
      }
      body.image = file.filename;
      const result =
        await this.categoryProductService.createCategoryProduct(body);

      const response = {
        'INFORMATION-RESPONSE': {
          REQUESTNAME: 'CREATE CATEGORY PRODUCT',
          METHOD: 'POST',
          'STATUS-RESPONSE': HttpStatus.CREATED,
          url: 'http://127.0.0.1:3000/category-product/create/',
        },
        'RESPONSE-DATA': {
          id: result.id,
          name: result.name,
          image: result.image,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        },
      };
      return response;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('/update/:id')
  @UseInterceptors(FileInterceptor('image', StorageUploadCategory))
  async updateCategoryProduct(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Prisma.CategoryProductUpdateInput,
  ) {
    try {
      const categoryId = parseInt(id.toString(), 10);
      const categoryProduct =
        await this.categoryProductService.findOneCategoryProduct(categoryId);

      if (!categoryProduct) {
        throw new HttpException(
          'Category product not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (file && file.filename) {
        const oldImagePath = `./public/img/category/${categoryProduct.image}`;
        if (existsSync(oldImagePath)) {
          unlinkSync(oldImagePath);
          console.log(`Deleted old image file: ${oldImagePath}`);
        } else {
          console.log(`File not found: ${oldImagePath}`);
        }

        body.image = file.filename;
      }
      if (body.name || body.image) {
        const updatedProduct =
          await this.categoryProductService.updateCategoryProduct(
            categoryId,
            body,
          );
        const response = {
          'INFORMATION-RESPONSE': {
            REQUESTNAME: 'UPDATE CATEGORY PRODUCT',
            METHOD: 'PATCH',
            'STATUS-RESPONSE': HttpStatus.OK,
            url: 'http://127.0.0.1:3000/category-product/update/id',
          },
          'RESPONSE-DATA': {
            id: updatedProduct.id,
            name: updatedProduct.name,
            image: updatedProduct.image,
            createdAt: updatedProduct.createdAt,
            updatedAt: updatedProduct.updatedAt,
          },
        };
        return response;
      } else {
        throw new Error('No valid data provided for update');
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('delete/:id')
  async removeCategoryProduct(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    const deletedRecord =
      await this.categoryProductService.deleteCategoryProduct(+id);

    if (deletedRecord) {
      const filePath = `./public/img/category/${deletedRecord.image}`;
      try {
        unlinkSync(filePath);
        console.log(`Deleted image file: ${filePath}`);
      } catch (error) {
        console.error(`Error deleting image file: ${error}`);
      }
      const response = {
        'INFORMATION-RESPONSE': {
          REQUESTNAME: 'DELETE CATEGORY PRODUCT',
          METHOD: 'DELETE',
          'STATUS-RESPONSE': HttpStatus.OK,
          url: 'http://127.0.0.1:3000/category-product/delete/id',
        },
        'RESPONSE-DATA': {
          id: deletedRecord.id,
          name: deletedRecord.name,
          image: deletedRecord.image,
          createdAt: deletedRecord.createdAt,
          updatedAt: deletedRecord.updatedAt,
        },
      };
      return response;
    } else {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Record not found' });
    }
  }
}
