import { BadRequestException } from "./bad.request.exception";

export interface ValidationErrorPayloadInterface {
  constraints: {
    [s: string]: string[];
  };
  value: any;
  property: any;
  target: any;
}

export class ValidationException extends BadRequestException {
  constructor(data: ValidationErrorPayloadInterface[]) {
    super("Validation Errors", data);
  }
}
