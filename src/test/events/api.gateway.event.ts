import createEvent from "@serverless/event-mocks";
import { APIGatewayProxyEvent } from "aws-lambda";

export const createMockAPIGatewayEvent = ({ ...args }): APIGatewayProxyEvent =>
  createEvent("aws:apiGateway", {
    body: null,
    headers: {
      "Content-Type": "application/json",
    },
    httpMethod: "GET",
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
    path: "/hello",
    pathParameters: {},
    requestContext: {
      accountId: "123456789012",
      authorizer: null,
      resourceId: "us4z18",
      protocol: "https",
      stage: "test",
      requestId: "41b45ea3-70b5-11e6-b7bd-69b5aaebc7d9",
      identity: {
        accessKey: "",
        apiKeyId: "",
        cognitoIdentityPoolId: "",
        accountId: "",
        cognitoIdentityId: "",
        caller: "",
        apiKey: "",
        sourceIp: "192.168.100.1",
        cognitoAuthenticationType: "",
        cognitoAuthenticationProvider: "",
        principalOrgId: "123456789012",
        userArn: "",
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36 OPR/39.0.2256.48",
        user: "",
      },
      path: "",
      requestTimeEpoch: 0,
      resourcePath: "/{proxy+}",
      httpMethod: "GET",
      apiId: "wt6mne2s9k",
    },
    queryStringParameters: {},
    resource: "/{proxy+}",
    stageVariables: {},
    ...args,
  });
