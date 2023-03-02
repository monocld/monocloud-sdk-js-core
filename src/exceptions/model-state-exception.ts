import { MonoCloudBaseException } from './monocloud-base-exception';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class ModelStateException<T = any> extends MonoCloudBaseException {
  constructor(
    public readonly message: string,
    public readonly errors: ModelStateError<T>,
    public readonly raw: any
  ) {
    super();
  }
}

export type ModelStateError<T> = T extends object
  ? T extends Array<any>
    ? T[number] extends object
      ? {
          [P in keyof T]?: ModelStateError<T[P]>;
        }
      : string[][]
    : {
        [P in keyof T]?: ModelStateError<T[P]>;
      }
  : string[];
