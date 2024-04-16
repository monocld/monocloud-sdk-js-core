import { MonoCloudConfig } from './monocloud-config';
import { MonoCloudResponse } from '../models/monocloud-response';
import { MonoCloudException } from '../exceptions/monocloud-exception';
import { MonoCloudPageResponse } from '../models/monocloud-page-response';
import { PageModel } from '../models/page-model';
import { ProblemDetails } from '../models/problem-details';
import { ValidationExceptionTypes } from '../exceptions/validation-exception-types';
import { ErrorCodeValidationProblemDetails } from '../models/error-code-validation-problem-details';
import { KeyValidationProblemDetails } from '../models/key-validation-problem-details';
import { MonoCloudExceptionHandler } from '../exceptions/monocloud-exception-handler';
import { MonoCloudRequest } from '../models/monocloud-request';
import { Fetcher } from '../models/fetcher';

export abstract class MonoCloudClientBase {
  protected fetcher: Fetcher;

  constructor(configuration: MonoCloudConfig, fetcher?: Fetcher) {
    if (fetcher) {
      this.fetcher = fetcher;
    } else {
      if (!configuration) {
        throw new MonoCloudException('Configuration is required');
      }

      if (!configuration.domain) {
        throw new MonoCloudException('Tenant Domain is required');
      }

      if (!configuration.apiKey) {
        throw new MonoCloudException('Api Key is required');
      }

      const headers: Record<string, string> = {
        'X-API-KEY': configuration.apiKey,
        'Content-Type': 'application/json',
      };

      const baseUrl = `${this.sanitizeUrl(configuration.domain)}/api/`;

      this.fetcher = async (
        input: string | URL | globalThis.Request,
        init?: RequestInit
      ): Promise<Response> => {
        const url = new URL(input, baseUrl);

        const signal = AbortSignal.timeout(
          configuration.config?.timeout ?? 10000
        );
        signal.throwIfAborted();

        const resp = await fetch(url.toString(), { ...init, headers, signal });

        return resp;
      };
    }
  }

  protected async processRequest<T = unknown>(
    request: MonoCloudRequest
  ): Promise<MonoCloudResponse<T>> {
    try {
      const url = this.buildUrl(request.url, request.queryParams);

      const response = await this.fetcher(url, {
        method: request.method,
        body: request.body ? JSON.stringify(request.body) : undefined,
      });

      if (!response.ok) {
        await this.HandleErrorResponse(response);
      }

      return new MonoCloudResponse<T>(
        response.status,
        response.headers,
        (await response.json()) as T
      );
    } catch (e: any) {
      console.error(e);
      if (e instanceof MonoCloudException) {
        throw e;
      }

      if (e.name === 'TimeoutError') {
        throw new MonoCloudException(e.message);
      }

      throw new MonoCloudException('Something went wrong.');
    }
  }

  protected async processPaginatedRequest<T = unknown>(
    request: MonoCloudRequest
  ): Promise<MonoCloudPageResponse<T>> {
    try {
      const url = this.buildUrl(request.url, request.queryParams);

      const response = await this.fetcher(url, {
        method: request.method,
        body: request.body ? JSON.stringify(request.body) : undefined,
      });

      if (!response.ok) {
        await this.HandleErrorResponse(response);
      }

      const paginationData = this.resolvePaginationHeader(response.headers);

      return new MonoCloudPageResponse<T>(
        response.status,
        response.headers,
        (await response.json()) as T,
        paginationData
      );
    } catch (e: any) {
      if (e instanceof MonoCloudException) {
        throw e;
      }

      if (e.name === 'TimeoutError') {
        throw new MonoCloudException(e.message);
      }

      throw new MonoCloudException('Something went wrong.');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async HandleErrorResponse(response: Response): Promise<void> {
    const contentType = response.headers.get('content-type');
    if (contentType === 'application/problem+json') {
      const body = await response.json();
      let result = body
        ? new ProblemDetails(body as ProblemDetails)
        : undefined;

      if (result?.type === ValidationExceptionTypes.IdentityValidationError) {
        result = new ErrorCodeValidationProblemDetails(result);
      }

      if (result?.type === ValidationExceptionTypes.ValidationError) {
        result = new KeyValidationProblemDetails(result);
      }

      if (!result) {
        throw new MonoCloudException('Invalid body');
      }

      MonoCloudExceptionHandler.ThrowProblemErr(result);
    }

    const respStrng = await response.text();
    MonoCloudExceptionHandler.ThrowErr(
      response.status,
      respStrng && respStrng !== '' ? respStrng : response.statusText
    );
  }

  // eslint-disable-next-line class-methods-use-this
  private sanitizeUrl(url: string): string {
    let u = url;
    if (!u.startsWith('https://')) {
      u = `https://${u}`;
    }

    if (u.endsWith('/')) {
      u = u.substring(0, u.length - 1);
    }

    return u;
  }

  // eslint-disable-next-line class-methods-use-this
  private resolvePaginationHeader(headers: Headers): PageModel {
    const paginationHeader = headers.get('x-pagination');
    const pageData = paginationHeader
      ? JSON.parse(paginationHeader)
      : undefined;

    return {
      page_size: pageData?.page_size ?? 0,
      current_page: pageData?.current_page ?? 0,
      total_count: pageData?.total_count ?? 0,
      has_previous: pageData?.has_previous ?? false,
      has_next: pageData?.has_next ?? false,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private buildUrl(
    url: string,
    queryParams?: Record<string, string | number | boolean>
  ): string {
    let urlStr = url;

    if (urlStr.startsWith('/')) {
      urlStr = urlStr.substring(1, urlStr.length);
    }

    if (!queryParams) {
      return urlStr;
    }

    urlStr += '?';

    Object.keys(queryParams).forEach(key => {
      urlStr += `${key}=${encodeURIComponent(queryParams[key])}&`;
    });

    urlStr = urlStr.substring(0, urlStr.length - 1);

    return urlStr;
  }
}
