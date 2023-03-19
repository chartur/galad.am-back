import { diskStorage, StorageEngine } from "multer";
import * as crypto from "crypto";
import { promisify } from "util";
import * as fs from "fs";
const randomBytesPromise = promisify(crypto.randomBytes);

export class Uploader {
  static fileStore(path: string): StorageEngine {
    return diskStorage({
      destination: (req, file, callback) => {
        const params = req.params;
        for (const key in params) {
          path = path.replace(`:${key}`, params[key].toString());
        }

        fs.mkdir(path, { recursive: true }, (err) => {
          if (err) {
            throw err;
          }

          callback(null, path);
        });
      },

      filename: (req, file, callback) => {
        const extension = file.mimetype.split("/")[1];
        Uploader.generateRandomName().then((name) => {
          callback(null, `${name}.${extension}`);
        });
      },
    });
  }

  static generateRandomName(size = 12): Promise<string> {
    return randomBytesPromise(size).then((buffer) => buffer.toString("hex"));
  }
}
