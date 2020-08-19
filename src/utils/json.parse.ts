import { APIGatewayEvent } from "aws-lambda";
import { BadRequestException } from "../exceptions";

export const JSONParse = (event: APIGatewayEvent): any => {
  let json: any;
  const contentType = event?.headers['Content-Type'] || event?.headers['content-type'] || '';

  if (
    typeof event.body === "string" &&
    contentType.toLowerCase() === "application/json"
  ) {
    try {
      json = JSON.parse(event.body);
    } catch (e) {
      throw new BadRequestException("Malformed JSON");
    }
  }
  return json;
};
