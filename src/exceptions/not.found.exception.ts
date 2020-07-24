import { HttpStatusCode } from "../enums";
import { HttpErrorException } from "./http.error.exception";

export class NotFoundException extends HttpErrorException {
  constructor(readonly message: string = "Not Found", data?: any) {
    super(message, HttpStatusCode.NOT_FOUND, data);
  }
}
