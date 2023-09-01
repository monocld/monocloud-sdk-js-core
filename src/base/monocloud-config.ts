export type MonoCloudConfig = {
  domain: string;
  apiKey: string;
  config?: {
    timeout?: number;
    retry?: boolean;
  };
};
