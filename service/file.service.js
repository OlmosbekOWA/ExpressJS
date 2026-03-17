import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import path from "path";
import BaseError from "../errors/base.error.js";

class FileService {
    /**
     * Rasmni saqlaydi. Agar file kelmasa → null qaytaradi
     * @param {Object|undefined} file - req.files.image yoki shunga o'xshash multer file obyekti
     * @returns {string|null} saqlangan fayl nomi yoki null
     */
    async save(file) {
        // Agar file umuman kelmasa yoki undefined bo'lsa → darrov null qaytaramiz
        if (!file) {
            return null;
        }

        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB

        if (!ALLOWED_TYPES.includes(file.mimetype)) {
            throw BaseError.BadRequest("Only JPEG, PNG, WebP allowed");
        }
        if (file.size > MAX_SIZE) {
            throw BaseError.BadRequest("File too large (max 5MB)");
        }

        try {
            const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;           
            const currentDir = import.meta.dirname;
            const staticDir = path.join(currentDir, "..", "static");
            const filePath = path.join(staticDir, fileName);

            // static papka yo'q bo'lsa yaratamiz
            if (!fs.existsSync(staticDir)) {
                fs.mkdirSync(staticDir, { recursive: true });
            }

            await new Promise((resolve, reject) => {
                file.mv(filePath, (err) => {
                    if (err) {
                        reject(BaseError.BadRequest("Fayl saqlashda xato"));
                    } else {
                        resolve();
                    }
                });
            });

            return fileName;

        } catch (error) {
            throw BaseError.BadRequest("Rasm saqlanmadi");
        }
    }
}

export default new FileService();