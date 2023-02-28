/* eslint-disable @typescript-eslint/no-explicit-any */
export class ForbiddenException extends Error {
  constructor(public readonly message: string, public readonly raw: any) {
    super(message);
  }
}
