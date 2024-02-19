import { ErrorCodeValidationProblemDetails } from '../models/error-code-validation-problem-details';
import { KeyValidationProblemDetails } from '../models/key-validation-problem-details';
import { ProblemDetails } from '../models/problem-details';
import { MonoCloudBadRequestException } from './monocloud-bad-request-exception';
import { MonoCloudConflictException } from './monocloud-conflict-exception';
import { MonoCloudErrorCodeValidationException } from './monocloud-error-code-validation-exception';
import { MonoCloudException } from './monocloud-exception';
import { MonoCloudKeyValidationException } from './monocloud-key-validation-exception';
import { MonoCloudModelStateException } from './monocloud-model-state-exception';
import { MonoCloudNotFoundException } from './monocloud-not-found-exception';
import { MonoCloudResourceExhaustedException } from './monocloud-resource-exhausted-exception';
import { MonoCloudServerException } from './monocloud-server-exception';
import { MonoCloudUnauthorizedException } from './monocloud-unauthorized-exception';

/// <summary>
/// The MonoCloud Exception Handler
/// </summary>
export class MonoCloudExceptionHandler {
  /// <summary>
  /// Converts the Problem Details returned from the server into an exception
  /// </summary>
  /// <param name="problemDetails">The problem details returned from the server.</param>
  /// <returns></returns>
  public static ThrowProblemErr(problemDetails: ProblemDetails): void {
    switch (problemDetails.status) {
      case 400:
        throw new MonoCloudBadRequestException(problemDetails);
      case 401:
        throw new MonoCloudUnauthorizedException(problemDetails);
      case 403:
        throw new MonoCloudUnauthorizedException(problemDetails);
      case 404:
        throw new MonoCloudNotFoundException(problemDetails);
      case 409:
        throw new MonoCloudConflictException(problemDetails);
      case 422:
        if (problemDetails instanceof ErrorCodeValidationProblemDetails) {
          throw new MonoCloudErrorCodeValidationException(problemDetails);
        }

        if (problemDetails instanceof KeyValidationProblemDetails) {
          throw new MonoCloudKeyValidationException(problemDetails);
        }

        throw new MonoCloudModelStateException(problemDetails);
      case 429:
        throw new MonoCloudResourceExhaustedException(problemDetails);
      case 500:
        throw new MonoCloudServerException(problemDetails);
      default:
        throw new MonoCloudException(
          problemDetails.title ?? 'An Unknown Error Occured'
        );
    }
  }

  /// <summary>
  /// Converts the error returned from the server into an exception
  /// </summary>
  /// <param name="statusCode">The response status code.</param>
  /// <param name="message">The error message returned from the server.</param>
  /// <returns></returns>
  public static ThrowErr(statusCode: number, message?: string): void {
    switch (statusCode) {
      case 400:
        throw new MonoCloudBadRequestException(message ?? 'Bad Request');
      case 401:
        throw new MonoCloudUnauthorizedException(message ?? 'Unauthorized');
      case 403:
        throw new MonoCloudUnauthorizedException(message ?? 'Forbidden');
      case 404:
        throw new MonoCloudNotFoundException(message ?? 'Not Found');
      case 409:
        throw new MonoCloudConflictException(message ?? 'Conflict');
      case 422:
        throw new MonoCloudModelStateException(
          message ?? 'Unprocessable entity'
        );
      case 429:
        throw new MonoCloudResourceExhaustedException(
          message ?? 'Resource Exhausted'
        );
      case 500:
        throw new MonoCloudServerException(message ?? 'Server Error');
      default:
        throw new MonoCloudException(message ?? 'An Unknown Error Occured');
    }
  }
}
