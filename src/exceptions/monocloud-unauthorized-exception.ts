import { ProblemDetails } from '../models/problem-details';
import { MonoCloudRequestException } from './monocloud-request-exception';

/// <summary>
/// The MonoCloud Unauthorized Exception
/// </summary>
export class MonoCloudUnauthorizedException extends MonoCloudRequestException {
  /// <summary>
  /// Initializes the MonoCloudUnauthorizedException Class
  /// </summary>
  /// <param name="response">The problem details returned from the server.</param>
  constructor(response: ProblemDetails);

  /// <summary>
  /// Initializes the MonoCloudUnauthorizedException Class
  /// </summary>
  /// <param name="message">The error message.</param>
  constructor(message: string);
  constructor(arg: ProblemDetails | string) {
    if (typeof arg === 'string') {
      super(arg);
    } else {
      super(arg);
    }
  }
}
