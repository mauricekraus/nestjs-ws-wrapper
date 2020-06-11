import { Metakeys } from './meta-keys.enum';

export function SocketInit(): MethodDecorator {
  return (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(Metakeys.ConnectionInit, true, descriptor.value);
    return descriptor;
  };
}
