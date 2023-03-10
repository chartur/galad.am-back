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

@Catch(HttpException)
export class DeleteUploadedFileOnErrorFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (request.file) {
      await unlinkFilePromise(request.file.path);
    }

    response.status(status).send(exception);
  }
}
