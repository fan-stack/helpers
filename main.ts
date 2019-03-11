// tslint:disable: jsdoc-format
import {
  CanActivate,
  ExceptionFilter,
  NestInterceptor,
  PipeTransform
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { https } from 'firebase-functions';

export interface IGlobalOptions<T = any> {
  prefix?: string;
  filters?: ExceptionFilter[];
  guards?: CanActivate[];
  interceptors?: NestInterceptor[];
  pipes?: Array<PipeTransform<T>>;
}

const defaultOptions: IGlobalOptions = {
  filters: [],
  guards: [],
  interceptors: [],
  pipes: []
};

/**
 * Returns an HTTP handler that can be used on Firebase HTTPS Functions.
 *
 * @example
 * export const api = functions.https.onRequest(nestToFirebase(AppModule))
 * @example
 * export const api = functions.https.onRequest(nestToFirebase(AppModule, { prefix: 'api' }))
 * @deprecated Use `nestToFirebaseHandler` instead
 * @param nestModule NestJS module
 */
export function nestToFirebase<T = any>(
  nestModule: any,
  options: IGlobalOptions<T> = defaultOptions
) {
  return async (req: express.Request, res: express.Response) => {
    const expressInstance = express();
    const nestApp = await NestFactory.create(nestModule, expressInstance);
    if (typeof options.prefix === 'string' && options.prefix.length > 0) {
      nestApp.setGlobalPrefix(options.prefix);
    }
    if (Array.isArray(options.filters) && options.filters.length > 0) {
      nestApp.useGlobalFilters(...options.filters);
    }
    if (Array.isArray(options.guards) && options.guards.length > 0) {
      nestApp.useGlobalGuards(...options.guards);
    }
    if (
      Array.isArray(options.interceptors) &&
      options.interceptors.length > 0
    ) {
      nestApp.useGlobalInterceptors(...options.interceptors);
    }
    if (Array.isArray(options.pipes) && options.pipes.length > 0) {
      nestApp.useGlobalPipes(...options.pipes);
    }
    await nestApp.init();
    expressInstance(req, res);
  };
}

/**
 * Returns an HTTP handler that can be used on Firebase HTTPS Functions.
 *
 * @example
 * export const api = functions.https.onRequest(nestToFirebaseHandler(AppModule))
 * @example
 * export const api = functions.https.onRequest(nestToFirebaseHandler(AppModule, { prefix: 'api' }))
 * @param nestModule NestJS module
 */
export function nestToFirebaseHandler<T = any>(
  nestModule: any,
  options: IGlobalOptions<T> = defaultOptions
) {
  return nestToFirebase(nestModule, options);
}

/**
 * Returns an HTTP Function ready to be exported.
 *
 * @example
 * export const api = nestToFirebaseFunction(AppModule)
 * @example
 * export const api = nestToFirebaseFunction(AppModule, { prefix: 'api' })
 * @param nestModule NestJS module
 */
export function nestToFirebaseFunction<T = any>(
  nestModule: any,
  options: IGlobalOptions<T> = defaultOptions
) {
  return https.onRequest(nestToFirebaseHandler(nestModule, options));
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
 * @example
 * ```ts
 @FanHttp({ prefix: 'api/v1', pipes: [new ValidationPipe()] })
 @Module({
   controllers: [UsersController],
   providers: [UsersService]
 })
 export class UsersModule {}
   ```
 */
export function FanHttp<T = any>(
  options: IGlobalOptions<T> = defaultOptions
): ClassDecorator {
  return (target: object) => nestToFirebaseFunction(target, options) as any;
}
