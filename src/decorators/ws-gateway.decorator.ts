import { Metakeys } from './meta-keys.enum';

export function WSGateway(path: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(Metakeys.GatewayPath, path, target);
  };
}
