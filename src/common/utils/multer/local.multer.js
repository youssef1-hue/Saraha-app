import randomUUID from 'node:crypto';
import multer from 'multer';
import { resolve } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import { fileFilter } from './validation.multer.js';

export const localFileUpload = ({
    customPath = "general",
    validation = []
}) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const fullPath = resolve(`../uploads/${customPath}`);
            if (existsSync(fullPath) === false) {
                mkdirSync(fullPath, { recursive: true });
            }
            cb(null, fullPath);
        },
        filename: function (req, file, cb) {
            const uniqueFileName = uuidv4() + "-" + file.originalname;
            file.finalPath = `uploads/${customPath}/${uniqueFileName}`;
            cb(null, uniqueFileName);
        }
    });

    return multer({ storage, fileFilter: fileFilter(validation) });
}