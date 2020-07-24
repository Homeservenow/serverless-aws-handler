import { HttpStatusCode } from "../enums";
import { HttpErrorException } from "./http.error.exception";

export class ForbiddenException extends HttpErrorException {
  constructor(readonly message: string = "Forbidden", data?: any) {
    super(message, HttpStatusCode.FORBIDDEN, data);
  }
}
