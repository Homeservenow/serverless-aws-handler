import { APIGatewayEvent } from "aws-lambda";

export type ValidatorFunction<Payload> = (value: any) => Payload;
