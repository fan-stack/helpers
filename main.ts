import { NestFactory } from '@nestjs/core';
import * as express from 'express';

export function nestToFirebase(nestModule: any) {
  return async (req: express.Request, res: express.Response) => {
    const expressInstance = express();
    await (await NestFactory.create(nestModule, expressInstance)).init();
    expressInstance(req, res);
  };
}
