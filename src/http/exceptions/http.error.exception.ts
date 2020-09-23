import { HttpErrorResponseInterface } from "../interfaces";
import { HttpStatusCode } from "../enums";

export class HttpErrorException extends Error
  implements HttpErrorResponseInterface {
  constructor(
    readonly message: string,
    readonly status: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
    readonly data?: any,
    readonly headers: { [s: string]: string | number } = {},
  ) {
    super(message);
  }

  getMessage(): string {
    return this.message;
  }

  getStatus(): HttpStatusCode {
    return this.status;
  }

  hasData(): boolean {
    return this.data;
  }

  getData(): any {
    return this.data;
  }
}
