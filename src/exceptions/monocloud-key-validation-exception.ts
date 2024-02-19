import { KeyValidationProblemDetails } from '../models/key-validation-problem-details';
import { MonoCloudRequestException } from './monocloud-request-exception';

/// <summary>
/// The MonoCloud Key Validation Exception Exception
/// </summary>
export class MonoCloudKeyValidationException extends MonoCloudRequestException {
  errors: { [key: string]: string[] };

  /// <summary>
  /// Initializes the MonoCloudKeyValidationException Class
  /// </summary>
  /// <param name="response">The problem details returned from the server.</param>
  constructor(response: KeyValidationProblemDetails) {
    super(
      response,
      `${response.title} : ${JSON.stringify(response.errors, undefined, 2)}`
    );
    this.errors = response.errors;
  }
}
