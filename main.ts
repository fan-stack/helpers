// tslint:disable: jsdoc-format
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { https } from 'firebase-functions';

/**
 * Returns an HTTP handler that can be used on Firebase HTTPS Functions.
 *
 * @example
 * export const api = functions.https.onRequest(nestToFirebase(AppModule))
 * @deprecated Use `nestToFirebaseHandler` instead
 * @param nestModule NestJS module
 */
export function nestToFirebase(nestModule: any) {
  return async (req: express.Request, res: express.Response) => {
    const expressInstance = express();
    await (await NestFactory.create(nestModule, expressInstance)).init();
    expressInstance(req, res);
  };
}

/**
 * Returns an HTTP handler that can be used on Firebase HTTPS Functions.
 *
 * @example
 * export const api = functions.https.onRequest(nestToFirebaseHandler(AppModule))
 * @param nestModule NestJS module
 */
export function nestToFirebaseHandler(nestModule: any) {
  return nestToFirebase(nestModule);
}

/**
 * Returns an HTTP Function ready to be exported.
 *
 * @example
 * export const api = nestToFirebaseFunction(AppModule)
 * @param nestModule NestJS module
 */
export function nestToFirebaseFunction(nestModule: any) {
  return https.onRequest(nestToFirebaseHandler(nestModule));
}

/**
 * Transforms a NestJS Module into an HTTPS Firebase Function.
 *
 * @example
 * ```ts
@FanHttp()
@Module({
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
  ```
 */
export function FanHttp(): ClassDecorator {
  return (target: object) => nestToFirebaseFunction(target) as any;
}
