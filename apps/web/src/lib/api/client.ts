import { getApiBaseUrl, getApiV1Prefix } from "@/config/env";

import { ApiError, NetworkError } from "./errors";
import type { ApiResponse } from "./types";

export interface ApiClientOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function apiClient<T>(path: string, options: ApiClientOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  let response: Response;

  try {
    response = await fetch(url, {
      ...rest,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new NetworkError();
  }

  let payload: ApiResponse<T>;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError({
      code: "INVALID_RESPONSE",
      message: `Unexpected response from ${path}`,
    });
  }

  if (payload.error) {
    throw new ApiError(payload.error);
  }

  if (!response.ok) {
    throw new ApiError({
      code: "HTTP_ERROR",
      message: `Request failed with status ${response.status}`,
    });
  }

  return payload.data as T;
}

export function buildApiPath(segment: string): string {
  const prefix = getApiV1Prefix().replace(/\/$/, "");
  const normalizedSegment = segment.startsWith("/") ? segment : `/${segment}`;
  return `${prefix}${normalizedSegment}`;
}
