export class ProblemDetails {
  /// <summary>
  /// The type of error
  /// </summary>
  type: string;

  /// <summary>
  /// The title of the error
  /// </summary>
  title: string;

  /// <summary>
  /// The status code representing the error
  /// </summary>
  status: number;

  /// <summary>
  /// The error details
  /// </summary>
  detail: string;

  /// <summary>
  /// The instance
  /// </summary>
  instance: string;

  /// <summary>
  /// Additional data about the error
  /// </summary>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;

  constructor(response: ProblemDetails) {
    this.type = response.type;
    this.title = response.title;
    this.status = response.status;
    this.detail = response.detail;
    this.instance = response.instance;
    Object.keys(response)
      .filter(
        x => x !== 'type' && x !== 'title' && x !== 'status' && x !== 'instance'
      )
      .forEach(key => {
        this[key] = response[key];
      });
  }
}
