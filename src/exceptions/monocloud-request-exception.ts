/* eslint-disable prefer-destructuring */
import { ProblemDetails } from '../models/problem-details';
import { MonoCloudException } from './monocloud-exception';

export class MonoCloudRequestException extends MonoCloudException {
  /// <summary>
  /// The problem details received from the server.
  /// </summary>
  response?: ProblemDetails;

  /// <summary>
  /// Initializes the MonoCloudRequestException Class
  /// </summary>
  /// <param name="response">The problem details returned from the server.</param>
  constructor(response: ProblemDetails);

  /// <summary>
  /// Initializes the MonoCloudRequestException Class
  /// </summary>
  /// <param name="message">The error message.</param>
  constructor(message: string);

  /// <summary>
  /// Initializes the MonoCloudRequestException Class
  /// </summary>
  /// <param name="response">The problem details returned from the server.</param>
  /// <param name="message">The error message.</param>
  constructor(response: ProblemDetails, message: string);
  constructor(...args: [ProblemDetails, string] | [ProblemDetails] | [string]) {
    let problemDetails: ProblemDetails | undefined;
    let errorMessage: string | undefined;

    if (Array.isArray(args)) {
      if (args.length === 2) {
        problemDetails = args[0];
        errorMessage = args[1];
      } else if (args.length === 1 && typeof args[0] === 'string') {
        errorMessage = args[0];
      } else if (args.length === 1 && typeof args[0] === 'object') {
        problemDetails = args[0];
        errorMessage = args[0].title;
      } else {
        throw new Error('Invalid arguments in constructor');
      }
    }

    if (!errorMessage) {
      throw new Error('Invalid error message');
    }

    super(errorMessage);
    this.response = problemDetails;
  }
}
