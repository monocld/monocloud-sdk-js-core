/* eslint-disable @typescript-eslint/no-explicit-any */

export class MonoCloudResponse<TResult = any> {
  status: number;

  headers: { [key: string]: any };

  result: TResult;

  constructor(
    status: number,
    headers: { [key: string]: any },
    result: TResult
  ) {
    this.status = status;
    this.headers = headers;
    this.result = result;
  }
}
