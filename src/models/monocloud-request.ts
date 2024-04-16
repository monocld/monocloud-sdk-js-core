export interface MonoCloudRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  queryParams?: Record<string, string>;
  body?: object;
}
