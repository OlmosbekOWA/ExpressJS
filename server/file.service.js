import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import path from "path";

class FileService {
    /**
     * Rasmni saqlaydi. Agar file kelmasa → null qaytaradi
     * @param {Object|undefined} file - req.files.image yoki shunga o'xshash multer file obyekti
     * @returns {string|null} saqlangan fayl nomi yoki null
     */
    save(file) {
        // Agar file umuman kelmasa yoki undefined bo'lsa → darrov null qaytaramiz
        if (!file) {
            return null;
        }

        try {
            const fileName = `${uuidv4()}.jpg`;           
            const currentDir = import.meta.dirname;
            const staticDir = path.join(currentDir, "..", "static");
            const filePath = path.join(staticDir, fileName);

            // static papka yo'q bo'lsa yaratamiz
            if (!fs.existsSync(staticDir)) {
                fs.mkdirSync(staticDir, { recursive: true });
            }

            file.mv(filePath, (err) => {
                if (err) {
                    console.log("Fayl saqlashda xato:", err);
                    throw err;
                }
            });

            return fileName;

        } catch (error) {
            console.error("Rasm saqlashda xato:", error.message);
            throw new Error("Rasm saqlanmadi");
        }
    }
}

export default new FileService();