export type MonoCloudConfig = {
  tenantId?: string;
  apiKey?: string;
  config?: {
    timeout?: number;
    retry?: boolean;
  };
};
