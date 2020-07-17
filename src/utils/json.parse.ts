import { APIGatewayEvent } from "aws-lambda";
import { BadRequestException } from "../exceptions";

export const JSONParse = (event: APIGatewayEvent): any => {
  let json: any;
  if (
    typeof event.body === "string" &&
    event?.headers["Content-Type"]?.toLowerCase() === "application/json"
  ) {
    try {
      json = JSON.parse(event.body);
    } catch (e) {
      throw new BadRequestException("Malformed JSON");
    }
  }
  return json;
};
