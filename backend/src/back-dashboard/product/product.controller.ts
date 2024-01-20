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
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageUploadProduct } from 'src/utils/storage-upload';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('read-all')
  async getAllProduct(@Res() response: Response) {
    try {
      const data = await this.productService.findAllProducts();
      const responseData = data.map((item) => ({
        id: item.id,
        name: item.name,
        desc: item.desc,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        categoryproductId: item.categoryproductId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      const responseObject = {
        'INFORMATION-RESPONSE': {
          REQUESTNAME: 'READ PRODUCT ALL',
          METHOD: 'GET',
          'STATUS-RESPONSE': HttpStatus.OK,
          url: 'http://127.0.0.1:3000/product/real-all/',
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
  async getOneProduct(@Param('id') id: number) {
    const result = await this.productService.findOneProduct(+id);
    if (result) {
      const response = {
        'INFORMATION-RESPONSE': {
          REQUESTNAME: 'READ ONE PRODUCT BY ID',
          METHOD: 'GET',
          'STATUS-RESPONSE': HttpStatus.OK,
          url: `http://127.0.0.1:3000/product/read-by-id/${id}`,
        },
        'RESPONSE-DATA': {
          id: result.id,
          name: result.name,
          desc: result.desc,
          price: result.price,
          quantity: result.quantity,
          image: result.image,
          categoryproductId: result.categoryproductId,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        },
      };
      return response;
    } else {
      const response = {
        'INFORMATION-RESPONSE': {
          REQUESTNAME: 'READ ONE PRODUCT BY ID',
          METHOD: 'GET',
          'STATUS-RESPONSE': HttpStatus.NOT_FOUND,
          url: `http://127.0.0.1:3000/product/read-by-id/${id}`,
        },
        ERROR: {
          message: 'Product not found',
        },
      };
      return response;
    }
  }

  // @Post('create')
  // @UseInterceptors(FileInterceptor('image', StorageUploadProduct))
  // async addProduct(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() body: Prisma.ProductCreateInput,
  // ) {
  //   try {
  //     if (!file || !file.filename) {
  //       throw new Error('No image file uploaded');
  //     }
  //     body.image = file.filename;
  //     const result =
  //       await this.productService.createProduct(body);

  //     const response = {
  //       'INFORMATION-RESPONSE': {
  //         REQUESTNAME: 'CREATE PRODUCT',
  //         METHOD: 'POST',
  //         'STATUS-RESPONSE': HttpStatus.CREATED,
  //         url: 'http://127.0.0.1:3000/product/create/',
  //       },
  //       'RESPONSE-DATA': {
  //         id: result.id,
  //         name: result.name,
  //         desc: result.desc,
  //         price: result.price,
  //         quantity: result.quantity,
  //         image: result.image,  
  //         categoryproductId: result.categoryproductId,  
  //         createdAt: result.createdAt,
  //         updatedAt: result.updatedAt,
  //       },
  //     };
  //     return response;
  //   } catch (error) {
  //     console.error(error);
  //     throw new HttpException(
  //       'Internal Server Error',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // ProductController
@Post('create')
@UseInterceptors(FileInterceptor('image', StorageUploadProduct))
async addProduct(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: Prisma.ProductCreateInput,
) {
  try {
    if (!file || !file.filename) {
      throw new Error('No image file uploaded');
    }
    body.image = file.filename;
    const result = await this.productService.createProduct(body);
    const response = {
      'INFORMATION-RESPONSE': {
        REQUESTNAME: 'CREATE PRODUCT',
        METHOD: 'POST',
        'STATUS-RESPONSE': HttpStatus.CREATED,
        url: 'http://127.0.0.1:3000/product/create/',
      },
      'RESPONSE-DATA': {
        id: result.id,
        name: result.name,
        desc: result.desc,
        price: result.price,
        quantity: result.quantity,
        image: result.image,
        categoryproductId: result.categoryproductId,
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

}
