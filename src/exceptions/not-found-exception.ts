/* eslint-disable @typescript-eslint/no-explicit-any */
export class NotFoundException extends Error {
  constructor(public readonly message: string, public readonly raw: any) {
    super(message);
  }
}
