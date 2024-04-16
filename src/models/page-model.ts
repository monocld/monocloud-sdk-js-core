export interface PageModel {
  /// <summary>
  /// Page Size
  /// </summary>
  page_size: number;

  /// <summary>
  /// Current Page
  /// </summary>
  current_page: number;

  /// <summary>
  /// Total Number of Items
  /// </summary>
  total_count: number;

  /// <summary>
  /// Specfies whether there is a previous page
  /// </summary>
  has_previous: boolean;

  /// <summary>
  /// Specfies whether there is a next page
  /// </summary>
  has_next: boolean;
}
