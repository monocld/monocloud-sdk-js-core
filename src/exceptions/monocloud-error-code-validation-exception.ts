import { ErrorCodeValidationError } from '../models/error-code-validation-error';
import { ErrorCodeValidationProblemDetails } from '../models/error-code-validation-problem-details';
import { MonoCloudRequestException } from './monocloud-request-exception';

/// <summary>
/// The MonoCloud Error Code Validation Exception
/// </summary>
export class MonoCloudErrorCodeValidationException extends MonoCloudRequestException {
  errors: ErrorCodeValidationError[];

  /// <summary>
  /// Initializes the MonoCloudErrorCodeValidationException Class
  /// </summary>
  /// <param name="response">The problem details returned from the server.</param>
  constructor(response: ErrorCodeValidationProblemDetails) {
    super(
      response,
      `${response.title} : ${JSON.stringify(response.errors, undefined, 2)}`
    );
    this.errors = response.errors;
  }
}
