import { APIGatewayEvent } from "aws-lambda";

export type ValidatorFunction = (value: APIGatewayEvent) => void;
