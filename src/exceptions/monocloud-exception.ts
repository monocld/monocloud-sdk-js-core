/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { unflatten } from 'flat';
import { BadRequestException } from './bad-request-exception';
import { ResourceExhaustedException } from './resource-exhausted-exception';
import { ForbiddenException } from './forbidden-exception';
import { ServerErrorException } from './server-error-exception';
import { NotFoundException } from './not-found-exception';
import { UnauthorizedException } from './unauthorized-exception';
import { ModelStateError, ModelStateException } from './model-state-exception';
import { ConflictException } from './conflict-exception';

export class MonoCloudException extends Error {
  constructor(public readonly message: string) {
    super();
  }

  public static throwErr(response: any): void {
    const { status } = response;

    if (status === 400) {
      throw new BadRequestException(response?.title ?? 'Bad Request', response);
    }
    if (status === 401) {
      throw new UnauthorizedException(response?.title ?? 'Unauthorized');
    }
    if (status === 403) {
      throw new ForbiddenException(response?.title ?? 'Forbidden', response);
    }
    if (status === 404) {
      throw new NotFoundException(response?.title ?? 'Not Found', response);
    }
    if (status === 409) {
      throw new ConflictException(
        response?.title ?? 'Conflict',
        response?.errors ?? [],
        response
      );
    }
    if (status === 422) {
      throw new ModelStateException(
        response?.title ?? 'Model State Error',
        unflatten(response.errors) as ModelStateError<any>,
        response
      );
    }
    if (status === 429) {
      throw new ResourceExhaustedException(
        response?.title ?? 'Resource Exhausted',
        response
      );
    }
    if (status >= 500) {
      throw new ServerErrorException(
        response?.title ?? 'An Internal Error Occured on the server',
        status
      );
    }
  }
}
