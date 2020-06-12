import { Metakeys } from './meta-keys.enum';

export function SocketClose(): MethodDecorator {
  return (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(Metakeys.ConnectionClose, true, descriptor.value);
    return descriptor;
  };
}
