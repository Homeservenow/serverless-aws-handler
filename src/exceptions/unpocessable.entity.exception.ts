import { HttpStatusCode } from "../enums";
import { HttpErrorException } from "./http.error.exception";

export class UnprocessableEntityException extends HttpErrorException {
  constructor(readonly message: string = "Unprocessable Entity", data?: any) {
    super(message, HttpStatusCode.UNPROCESSABLE_ENTITY, data);
  }
}
