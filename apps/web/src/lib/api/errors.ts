import type { ErrorResponse } from "./types";

export class ApiError extends Error {
  readonly code: string;
  readonly details: Record<string, unknown>;

  constructor(error: ErrorResponse) {
    super(error.message);
    this.name = "ApiError";
    this.code = error.code;
    this.details = error.details ?? {};
  }
}

export class NetworkError extends Error {
  constructor(message = "Network request failed") {
    super(message);
    this.name = "NetworkError";
  }
}
