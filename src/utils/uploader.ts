import { diskStorage, StorageEngine } from "multer";
import * as crypto from "crypto";
import { promisify } from "util";
const randomBytesPromise = promisify(crypto.randomBytes);

export class Uploader {
  static fileStore(path: string): StorageEngine {
    return diskStorage({
      destination: path,
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
