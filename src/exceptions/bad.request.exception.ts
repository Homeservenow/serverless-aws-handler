import { HttpStatusCode } from "../enums";
import { HttpErrorException } from "./http.error.exception";

export class BadRequestException extends HttpErrorException {
  constructor(readonly message: string = "Bad Request", data?: any) {
    super(message, HttpStatusCode.BAD_REQUEST, data);
  }
}
