/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { BadRequestException } from './bad-request-exception';
import { ResourceExhaustedException } from './resource-exhausted-exception';
import { ForbiddenException } from './forbidden-exception';
import { ServerErrorException } from './server-error-exception';
import { NotFoundException } from './not-found-exception';
import { UnauthorizedException } from './unauthorized-exception';
import { ModelStateError, ModelStateException } from './model-state-exception';
import { ConflictException } from './conflict-exception';
import { unflatten } from './helper';

export class MonoCloudException extends Error {
  constructor(message: string);
  constructor(message: string, raw: any);
  constructor(
    public readonly message: string,
    public readonly raw?: any
  ) {
    super();
  }

  public static throwErr(response: AxiosResponse): void {
    const { status, data } = response;

    if (status === 400) {
      throw new BadRequestException(data?.title ?? 'Bad Request', response);
    }
    if (status === 401) {
      throw new UnauthorizedException(data?.title ?? 'Unauthorized');
    }
    if (status === 403) {
      throw new ForbiddenException(data?.title ?? 'Forbidden', response);
    }
    if (status === 404) {
      throw new NotFoundException(data?.title ?? 'Not Found', response);
    }
    if (status === 409) {
      throw new ConflictException(
        data?.title ?? 'Conflict',
        data?.errors ?? [],
        response
      );
    }
    if (status === 422) {
      throw new ModelStateException(
        data?.title ?? 'Model State Error',
        unflatten(data?.errors ?? {}) as ModelStateError<any>,
        response
      );
    }
    if (status === 429) {
      throw new ResourceExhaustedException(
        data?.title ?? 'Resource Exhausted',
        response
      );
    }
    if (status >= 500) {
      throw new ServerErrorException(
        data?.title ?? 'An Internal Error Occured on the server',
        status
      );
    }
  }
}
