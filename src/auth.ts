import { NestFactory } from '@nestjs/core';
import { auth, EventContext } from 'firebase-functions';

export type FanAuthTrigger = 'create' | 'delete';

type AuthHandler<T = any> = (
  user: auth.UserRecord,
  context: EventContext
) => PromiseLike<T>;

export function nestToAuthHandler(
  nestModule: any,
  nestController: any,
  handlerMethod: string
): AuthHandler {
  return async (user: auth.UserRecord, context: EventContext) => {
    const nestApp = await NestFactory.createApplicationContext(nestModule);
    const controllerInstance = nestApp.get(nestController);
    const handler: AuthHandler = controllerInstance[handlerMethod];

    return handler.call(controllerInstance, user, context);
  };
}

export function nestToAuthFunction(
  trigger: FanAuthTrigger,
  nestModule: any,
  nestController: any,
  handlerMethod: string
) {
  const handler = nestToAuthHandler(nestModule, nestController, handlerMethod);
  if (trigger === 'create') {
    return auth.user().onCreate(handler);
  }

  return auth.user().onDelete(handler);
}

export function FanAuth(
  trigger: FanAuthTrigger,
  nestController: any,
  handlerMethod: string
): ClassDecorator {
  return (nestModule: object) =>
    nestToAuthFunction(
      trigger,
      nestModule,
      nestController,
      handlerMethod
    ) as any;
}
