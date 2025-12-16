export interface ErrorResponse {
  message: string;
  code?: string;
  statusCode?: number;
}

export interface ApiResponse<T> {
  data?: T | null;
  successful: boolean;
  error?: ErrorResponse | null;
}
