import { Metakeys } from './meta-keys.enum';

function SocketGateway(path: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(Metakeys.GatewayPath, path, target);
    return target;
  };
}
