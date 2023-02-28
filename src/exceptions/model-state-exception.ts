/* eslint-disable @typescript-eslint/no-explicit-any */
export class ModelStateException<T = any> extends Error {
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
