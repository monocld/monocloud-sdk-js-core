export class ErrorCodeValidationError {
  /// <summary>
  /// The error code.
  /// </summary>
  code: string;

  /// <summary>
  /// Brief explanation of the error.
  /// </summary>
  description: string;

  constructor(code: string, description: string) {
    this.code = code;
    this.description = description;
  }
}
