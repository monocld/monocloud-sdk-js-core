import { MonoCloudResponse } from './monocloud-response';
import { PageModel } from './page-model';

export class MonoCloudPageResponse<
  TResult = unknown,
> extends MonoCloudResponse<TResult> {
  pageData: PageModel;

  constructor(
    status: number,
    headers: { [key: string]: any },
    result: TResult,
    pageData: PageModel
  ) {
    super(status, headers, result);
    this.pageData = pageData;
  }
}
