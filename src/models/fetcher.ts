export interface Fetcher {
  (
    input: string | URL | globalThis.Request,
    init?: RequestInit
  ): Promise<Response>;
}
