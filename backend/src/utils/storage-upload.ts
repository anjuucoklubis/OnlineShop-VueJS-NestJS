import { diskStorage } from "multer";
import { extname } from "path";

export const StorageUploadCategory = {
    storage: diskStorage({
        destination: './public/img/category',
        filename: (req, file, cb) => {
            const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
        }
    })
};

export const StorageUploadProduct = {
    storage: diskStorage({
        destination: './public/img/product',
        filename: (req, file, cb) => {
            const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
        }
    })
};