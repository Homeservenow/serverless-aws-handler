import { APIGatewayEvent } from "aws-lambda";
import { HttpErrorException } from "../exceptions";
import { HttpStatusCode } from "../enum";

export type APIGatewayJsonEvent<
  T extends { [s: string]: any }
> = APIGatewayEvent & {
  json: T;
};

export const JSONParse = <RequestType>(
  event: APIGatewayEvent,
): APIGatewayJsonEvent<RequestType> => {
  let jsonEvent: APIGatewayJsonEvent<RequestType>;

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
