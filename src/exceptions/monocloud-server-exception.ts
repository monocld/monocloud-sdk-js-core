import { ProblemDetails } from '../models/problem-details';
import { MonoCloudRequestException } from './monocloud-request-exception';

/// <summary>
/// The MonoCloud Server Exception
/// </summary>
export class MonoCloudServerException extends MonoCloudRequestException {
  /// <summary>
  /// Initializes the MonoCloudServerException Class
  /// </summary>
  /// <param name="response">The problem details returned from the server.</param>
  constructor(response: ProblemDetails);

  /// <summary>
  /// Initializes the MonoCloudServerException Class
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
