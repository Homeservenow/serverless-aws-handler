import { APIGatewayEvent } from "aws-lambda";
import { HttpErrorException } from "../exceptions";
import { HttpStatusCode } from "../enum";

export type APIGatewayJsonEvent<
  T extends { [s: string]: any }
> = APIGatewayEvent & {
  json: T;
};

export const JSONParse = <T>(
  event: APIGatewayEvent,
): APIGatewayJsonEvent<T> => {
  let jsonEvent: APIGatewayJsonEvent<T>;

  if (
    typeof event.body === "string" &&
    event?.headers["Content-Type"]?.toLowerCase() === "application/json"
  ) {
    try {
      jsonEvent = { ...event, json: JSON.parse(event.body) };

      return jsonEvent;
    } catch (e) {
      new HttpErrorException("Malformed JSON", HttpStatusCode.BAD_REQUEST);
    }
  }
};
