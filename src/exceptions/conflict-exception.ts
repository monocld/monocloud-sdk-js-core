/* eslint-disable @typescript-eslint/no-explicit-any */
export class ConflictException extends Error {
  constructor(
    public readonly message: string,
    public readonly errors: string[],
    public readonly raw: any
  ) {
    super();
  }
}
