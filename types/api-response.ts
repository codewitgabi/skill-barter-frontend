export interface SuccessResponse<T = unknown> {
  status: "success";
  message: string;
  data: T;
  httpStatus: number;
}

export interface ValidationErrorDetail {
  type: string;
  msg: string;
  path: string;
  location: string;
}

export interface ErrorResponse {
  statusCode: number;
  status: "error";
  error: {
    code: string;
    message: string;
    details: ValidationErrorDetail[] | [];
  };
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;
