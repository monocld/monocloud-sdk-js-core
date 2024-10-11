export class ErrorCodeValidationError {
  /// <summary>
  /// The error code.
  /// </summary>
  code: string;

  /// <summary>
  /// Brief explanation of the error.
  /// </summary>
  description: string;

  /// <summary>
  /// The field the error belongs to.
  /// </summary>
  field?: string;

  constructor(code: string, description: string, field?: string) {
    this.code = code;
    this.description = description;
    this.field = field;
  }
}
