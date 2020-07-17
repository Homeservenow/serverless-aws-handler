import { APIGatewayEvent } from "aws-lambda";
import { HttpErrorException } from "../exceptions";
import { HttpStatusCode } from "../enum";

export const JSONParse = (event: APIGatewayEvent): any => {
  let json: any;

  if (
    typeof event.body === "string" &&
    event?.headers["Content-Type"]?.toLowerCase() === "application/json"
  ) {
    try {
      json = JSON.parse(event.body);
    } catch (e) {
      new HttpErrorException("Malformed JSON", HttpStatusCode.BAD_REQUEST);
    }
  }
  return json;
};
