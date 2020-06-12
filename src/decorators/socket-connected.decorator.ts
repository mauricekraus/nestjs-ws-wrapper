import { Metakeys } from './meta-keys.enum';

export function SocketConnected(): MethodDecorator {
  return (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(Metakeys.ConnectionConnected, true, descriptor.value);
    return descriptor;
  };
}
