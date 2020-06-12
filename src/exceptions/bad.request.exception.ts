import { HttpStatusCode } from "../enum";
import { HttpErrorException } from "./http.error.exception";

export class BadRequestException extends HttpErrorException {
  constructor(readonly message: string = "Not found") {
    super(message, HttpStatusCode.BAD_REQUEST);
  }
}
