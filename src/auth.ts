import { NestFactory } from '@nestjs/core';
import { auth, EventContext } from 'firebase-functions';

export type FanAuthTrigger = 'create' | 'delete';

type AuthHandler<T = any> = (
  user: auth.UserRecord,
  context: EventContext
) => PromiseLike<T>;

export function nestToAuthHandler<
  TClass extends new (...args: any[]) => any,
  TMethodName extends keyof InstanceType<TClass>
>(
  nestModule: any,
  nestControllerOrService: TClass,
  handlerMethod: TMethodName
): AuthHandler {
  return async (user: auth.UserRecord, context: EventContext) => {
    const nestApp = await NestFactory.createApplicationContext(nestModule);
    const nestInstance = nestApp.get<InstanceType<TClass>>(
      nestControllerOrService
    );
    const handler: AuthHandler = nestInstance[handlerMethod];

    return handler.call(nestInstance, user, context);
  };
}

export function nestToAuthFunction<
  TClass extends new (...args: any[]) => any,
  TMethodName extends keyof InstanceType<TClass>
>(
  trigger: FanAuthTrigger,
  nestModule: any,
  nestControllerOrService: TClass,
  handlerMethod: TMethodName
) {
  const handler = nestToAuthHandler(
    nestModule,
    nestControllerOrService,
    handlerMethod
  );
  if (trigger === 'create') {
    return auth.user().onCreate(handler);
  }

  return auth.user().onDelete(handler);
}

export function FanAuth<
  TClass extends new (...args: any[]) => any,
  TMethodName extends keyof InstanceType<TClass>
>(
  trigger: FanAuthTrigger,
  nestControllerOrService: TClass,
  handlerMethod: TMethodName
): ClassDecorator {
  return (nestModule: object) =>
    nestToAuthFunction(
      trigger,
      nestModule,
      nestControllerOrService,
      handlerMethod
    ) as any;
}
