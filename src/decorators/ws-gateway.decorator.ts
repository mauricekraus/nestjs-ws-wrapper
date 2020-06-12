import { Metakeys } from './meta-keys.enum';

function WSGateway(path: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(Metakeys.GatewayPath, path, target);
    return target;
  };
}
