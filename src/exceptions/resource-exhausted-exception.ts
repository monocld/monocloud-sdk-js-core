import { MonoCloudBaseException } from './monocloud-base-exception';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class ResourceExhaustedException extends MonoCloudBaseException {
  constructor(public readonly message: string, public readonly raw: any) {
    super(message);
  }
}
