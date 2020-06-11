import { Metakeys } from './meta-keys.enum';

/**
 * Subscribes to messages that fulfils chosen pattern.
 */
export const SocketMessage = <T = string>(message: T): MethodDecorator => {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(
      Metakeys.MessageHandlerMapping,
      true,
      descriptor.value,
    );
    Reflect.defineMetadata(
      Metakeys.MesssageMetadata,
      message,
      descriptor.value,
    );
    return descriptor;
  };
};
