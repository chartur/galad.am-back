import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";
import * as fs from "fs";
import { promisify } from "util";
const unlinkFilePromise = promisify(fs.unlink);

@Catch(Error)
export class DeleteUploadedFileOnErrorFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus ? exception.getStatus() : 500;

    console.log("HEREEEEE");

    if (request.file) {
      await unlinkFilePromise(request.file.path);
    }

    if (Object.keys(request.files || {})?.length) {
      for (const fileName in request.files) {
        for (const file of request.files[fileName]) {
          await unlinkFilePromise(file.path);
        }
      }
    }

    response.status(status).send(exception);
  }
}
