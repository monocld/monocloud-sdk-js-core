import { MonoCloudBaseException } from './monocloud-base-exception';

export class ServerErrorException extends MonoCloudBaseException {
  constructor(
    public readonly message: string,
    public readonly status: number
  ) {
    super(message);
  }
}
