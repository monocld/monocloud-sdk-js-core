import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders,
} from 'axios';
import axiosRetry from 'axios-retry';
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

export abstract class MonoCloudClientBase {
  protected instance: AxiosInstance;

  constructor(configuration: MonoCloudConfig, instance?: AxiosInstance) {
    if (instance) {
      this.instance = instance;
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

      const config: AxiosRequestConfig = {
        baseURL: `${this.sanitizeUrl(configuration.domain)}/api`,
        headers,
        timeout: configuration.config?.timeout ?? 10000,
      };

      this.instance = axios.create(config);

      if (configuration.config?.retry === true) {
        axiosRetry(this.instance, { retries: 3 });
      }
    }
  }

  protected async processRequest<T = unknown>(
    request: AxiosRequestConfig
  ): Promise<MonoCloudResponse<T>> {
    try {
      const response = await this.instance.request(request);
      return await Promise.resolve(
        new MonoCloudResponse<T>(
          response.status,
          response.headers,
          response.data ?? null
        )
      );
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        this.HandleErrorResponse(e.response);
      }
      throw new MonoCloudException('Something went wrong.');
    }
  }

  protected async processPaginatedRequest<T = unknown>(
    request: AxiosRequestConfig
  ): Promise<MonoCloudPageResponse<T>> {
    try {
      const response = await this.instance.request(request);
      const paginationData = this.resolvePaginationHeader(response.headers);
      return await Promise.resolve(
        new MonoCloudPageResponse<T>(
          response.status,
          response.headers,
          response.data ?? null,
          paginationData
        )
      );
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        this.HandleErrorResponse(e.response);
      }
      throw new MonoCloudException('Something went wrong.');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private HandleErrorResponse(response: AxiosResponse): void {
    if (
      response.headers['Content-Type'] === 'application/problem+json' ||
      response.headers['content-type'] === 'application/problem+json'
    ) {
      let result = response.data
        ? new ProblemDetails(response.data)
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

    MonoCloudExceptionHandler.ThrowErr(
      response.status,
      response.data && response.data !== ''
        ? response.data
        : response.statusText
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
  private resolvePaginationHeader(
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders
  ): PageModel {
    const pageData = headers['x-pagination']
      ? JSON.parse(headers['x-pagination'])
      : undefined;
    const pageSize = pageData?.page_size ?? 0;
    const currentPage = pageData?.current_page ?? 0;
    const totalCount = pageData?.total_count ?? 0;
    const hasPrevious = pageData?.has_previous ?? false;
    const hasNext = pageData?.has_next ?? false;
    return new PageModel(
      pageSize,
      currentPage,
      totalCount,
      hasPrevious,
      hasNext
    );
  }
}
