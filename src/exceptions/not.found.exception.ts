import { HttpStatusCode } from "../enum";
import { HttpErrorException } from "./http.error.exception";

export class NotFoundException extends HttpErrorException {
  constructor(readonly message: string = "Not found") {
    super(message, HttpStatusCode.NOT_FOUND);
  }
}