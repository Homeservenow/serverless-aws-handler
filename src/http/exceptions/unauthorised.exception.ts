import { HttpStatusCode } from "../enums";
import { HttpErrorException } from "./http.error.exception";

export class UnauthorizedException extends HttpErrorException {
  constructor(readonly message: string = "Unauthorized", data?: any) {
    super(message, HttpStatusCode.UNAUTHORIZED, data);
  }
}
