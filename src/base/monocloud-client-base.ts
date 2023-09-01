import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { MonoCloudConfig } from './monocloud-config';
import { MonoCloudResponse } from './monocloud-response';
import { MonoCloudException } from '../exceptions/monocloud-exception';

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
        baseURL: `https://${configuration.domain}/api`,
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
        MonoCloudException.throwErr(e.response);
      }
      throw new MonoCloudException('Something went wrong.', e);
    }
  }
}
