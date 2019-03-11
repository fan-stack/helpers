import { auth, EventContext } from 'firebase-functions';

export type FanAuthTrigger = 'create' | 'delete';

export interface IFanAuthHandler<T = any> {
  handler: (user: auth.UserRecord, context: EventContext) => PromiseLike<T>;
}

export function controllerToAuthHandler<T = any>(controller: object) {
  const classifiedController = controller as new () => IFanAuthHandler;
  const controllerInstance: IFanAuthHandler<T> = new classifiedController();

  return controllerInstance.handler;
}

export function controllerToAuthFunction(
  trigger: FanAuthTrigger,
  target: object
) {
  const handler = controllerToAuthHandler(target);
  if (trigger === 'create') {
    return auth.user().onCreate(handler);
  }

  return auth.user().onDelete(handler);
}

export function FanAuth(trigger: FanAuthTrigger): ClassDecorator {
  return (target: object) => controllerToAuthFunction(trigger, target) as any;
}
