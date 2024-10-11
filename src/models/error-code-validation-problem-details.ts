import { ErrorCodeValidationError } from './error-code-validation-error';
import { ProblemDetails } from './problem-details';

export class ErrorCodeValidationProblemDetails extends ProblemDetails {
  errors: ErrorCodeValidationError[];

  constructor(response: ProblemDetails) {
    super(response);
    this.errors = (response.errors as ErrorCodeValidationError[]).map(
      err => new ErrorCodeValidationError(err.code, err.description, err.field)
    );
  }
}
