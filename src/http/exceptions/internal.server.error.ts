import { HttpStatusCode } from "../enums";
import { HttpErrorException } from "./http.error.exception";

export class InternalServerError extends HttpErrorException {
  constructor(readonly message: string = "Internal Server Error", data?: any) {
    super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, data);
  }
}
