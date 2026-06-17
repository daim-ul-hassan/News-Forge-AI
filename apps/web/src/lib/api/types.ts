export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ResponseMeta {
  request_id?: string | null;
  pagination?: Record<string, unknown> | null;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ErrorResponse | null;
  meta: ResponseMeta;
}
