## AWS Lambda generic handling for http

<a href="https://travis-ci.org/github/Homeservenow/severless-http-handler"><img src="https://api.travis-ci.org/Homeservenow/severless-http-handler.svg?branch=master" alt="travis"/></a>
<a href='https://coveralls.io/github/Homeservenow/severless-http-handler?branch=master'><img src='https://coveralls.io/repos/github/Homeservenow/severless-http-handler/badge.svg?branch=master' alt='Coverage Status' /></a>

Generic http handling wrapper function. 

## Install 

```bash
$ yarn add @homeservenow/serverless-aws-handler
```

#### Features
 - Error logging
 - Error handling - throwable exceptions that correspond to status codes
 - Payload serialisation
 - Strong types :muscle:
 
 ## Usage

 ```typescript
import {httpHandler, NotFoundException} from '@homeservenow/serverless-aws-handler';
import {APIGatewayEvent} from 'aws-lambda';
import {database} from './database';

export const getCatHandler = httpHandler(async (event: APIGatewayEvent): Promise<CatInterface> => {
    const cat = await database().findById(event?.pathParameters.id);

    if (!cat) {
        throw new NotFoundException();
    }

    return cat;
});
 ```

 The above will result in either a 200 status code
 ```JSON
 {
     "breed": "Tabby",
     "lives": 7,
     "name": "bob"
 }
```

Or if `NotFoundException` is thrown, a 404 status code (because of NotFoundException)

```JSON
{
    "message": "Not Found"
}
```

#### Post method example

You'll notice in this example, we're returning validation errors!

```typescript
import {httpHandler, NotFoundException, BadRequestException} from '@homeservenow/serverless-aws-handler';
import {APIGatewayEvent} from 'aws-lambda';
import {database} from './database';

export const createCatHandler = httpHandler<Partial<CatInterface>>(async (
        event: APIGatewayJsonEvent<Partial<CatInterface>>,
    ): Promise<CatInterface | never> => {

    const payload = event.json;

    const validationErrors = {};

    (["breed", "name", "lives"] as (keyof CatInterface)[]).forEach((property) => {
        if (!payload[property]) {
            validationErrors[property] = 'Cannot be blank!';
        }
    });

    if (Object.keys(validationErrors).length >= 1) {
        throw new BadRequestException('Validaiton Errors', validationErrors);
    }

    return database().create(payload);
});
```
If validation errors occur then the handler will return a 400 status code plus the below body

```JSON
{
    "message": "Validation Errors",
    "data": {
        "name": "Cannot be blank!"
    }
}
```

## Available HTTP exceptions

Exception name | status code | default message
---|---|---
`BadRequestException` | 400 | Bad Request
`UnauthorizedException` | 401 | Unauthorized
`ForbiddenException` | 403 | Forbidden
`NotFoundException` | 404 | Not Found
`UnProcessableEntityException` | 422 | 'Unprocessable Entity
`InternalServerError` | 500 | Internal Server Error

## Validator

```typescript
export const myHandler = httpHandler({
    handler: myHandlerMethod,
});
```

## Serialisation

#### Input

#### Output

## Custom Error Handling

## Default status code and headers

The below example will always output a status code of 204.

```typescript
export const myHandler = httpHandler({
    handler: (event: APIGatwayProxyEvent) => {

    },
    defaultStatusCode: HttpStatusCode.NO_CONTENT,
});
```
#### default Headers 

The below example will always output a header `X-header`

```typescript
export const myHandler = httpHandler({
    handler: (event: APIGatwayProxyEvent) => {

    },
    defaultHeaders: {
        ['X-header']: 'Hello!',
    },
});
```

## Exception logging options 

The httpHandler has its own default logging method which you can customise. This method will make info logs, warn logs and error logs using console.

There are several different logging methods 

- By http status
- Range by http status
- Blacklist | whitelist
- boolean

Logging is only called when an exception occurs. All of the below examples are generally for status codes of 400 and above. However it is possible to override.

#### Singular http status

Will only log `INTERNAL_SERVER_ERROR` (500) status codes.

```typescript
export const myHandler = httpHandler({
    handler: myHandlerMethod,
    loggingHandlingOpions: HttpStatusCode.INTERNAL_SERVER_ERROR,
});
```

#### Range by http status

A range will only log errors within the target range including the given values. In this example all exceptions with a status code between `400` and `403` will be logged. `500` Status codes will not be logged in this example.

```typescript
export const myHandler = httpHandler({
    handler: myHandlerMethod,
    loggingHandlingOpions: [HttpStatusCode.BAD_REQUEST, HttpStatusCode.FORBIDDEN],
});
```

##### Blacklist

If you was to use the blacklist without the whitelist, any status code not in the array will be logged. Anything other than 400 and 401 will be logged here.

```typescript
export const myHandler = httpHandler({
    handler: myHandlerMethod,
    loggingHandlingOpions: {
        blacklist: [
            HttpStatusCode.BAD_REQUEST,
            HttpStatusCode.UNAUTHORIZED,
        ],
    },
});
```

##### Whitelist

In this example, only 400 status code exceptions will be logged.

```typescript
export const myHandler = httpHandler({
    handler: myHandlerMethod,
    loggingHandlingOpions: {
        whitelist: [
            HttpStatusCode.BAD_REQUEST,
        ],
    },
});
```

#### Blacklist | Whitelist

In this example, any status code within a whitelist will be logged. Anything in the blacklist will not be logged. However. If the given status code is in both provided arrays, then the blacklist overrides the whitelist and the error will not be logged.

In the given example, only forbidden status codes will be logged. Any other status code will not.

```typescript
export const myHandler = httpHandler({
    handler: myHandlerMethod,
    loggingHandlingOpions: {
        blacklist: [
            HttpStatusCode.BAD_REQUEST,
            HttpStatusCode.UNAUTHORIZED,
        ],
        whitelist: [
            HttpStatusCode.BAD_REQUEST,
            HttpStatusCode.FORBIDDEN,
        ],
    },
});
```