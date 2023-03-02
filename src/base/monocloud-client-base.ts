import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import { MonoCloudConfig } from './monocloud-config';
import { MonoCloudResponse } from './monocloud-response';
import { MonoCloudException } from '../exceptions/monocloud-exception';

export abstract class MonoCloudClientBase {
  protected instance: AxiosInstance;

  constructor(
    configuration: MonoCloudConfig,
    baseUrl?: string,
    instance?: AxiosInstance
  ) {
    if (instance) {
      this.instance = instance;
    } else {
      if (!configuration) {
        throw new MonoCloudException('Configuration is required');
      }

      if (!configuration.tenantId) {
        throw new MonoCloudException('Tenant Id is required');
      }

      if (!configuration.apiKey) {
        throw new MonoCloudException('Api Key is required');
      }

      const headers: Record<string, string> = {
        'X-TENANT-ID': configuration.tenantId,
        'X-API-KEY': configuration.apiKey,
        'Content-Type': 'application/json',
      };

      const config: AxiosRequestConfig = {
        baseURL: baseUrl !== undefined && baseUrl !== null ? baseUrl : '',
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
      if (e instanceof AxiosError) {
        MonoCloudException.throwErr(e.response);
      }
      throw new MonoCloudException('Something went wrong.', e);
    }
  }
}
