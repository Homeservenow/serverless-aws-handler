## AWS Lambda generic handling for http

<a href="https://travis-ci.org/github/Homeservenow/severless-http-handler"><img src="https://api.travis-ci.org/Homeservenow/severless-http-handler.svg?branch=master" alt="travis"/></a>
<a href='https://coveralls.io/github/Homeservenow/severless-http-handler?branch=master'><img src='https://coveralls.io/repos/github/Homeservenow/severless-http-handler/badge.svg?branch=master' alt='Coverage Status' /></a>
<a href="https://www.npmjs.com/package/@homeservenow/serverless-aws-handler"><img src="https://img.shields.io/npm/v/@homeservenow/serverless-aws-handler" alt="npm"/></a>

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
import { httpHandler, NotFoundException } from '@homeservenow/serverless-aws-handler';
import { database } from './database';

export const getCatHandler = httpHandler(async ({event}): Promise<CatInterface> => {
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
import { httpHandler, BadRequestException } from '@homeservenow/serverless-aws-handler';
import { database } from './database';

export const createCatHandler = httpHandler<CatInterface>({
    validator: (payload: any): CatInterface => {
        const validationErrors = {};

        (["breed", "name", "lives"] as (keyof CatInterface)[]).forEach((property) => {
            if (!payload[property]) {
                validationErrors[property] = 'Cannot be blank!';
            }
        });

        if (Object.keys(validationErrors).length >= 1) {
            throw new BadRequestException('Validaiton Errors', validationErrors);
        }

        return new CatDTO(payload);
    },
    handler: async ({payload}): Promise<CatInterface | never> => {
        return database().create(payload);
    },
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

### Not Found example

```typescript
import { httpHandler, NotFoundException } from '@homeservenow/serverless-aws-handler';
import {database} from './database';

export const getCatHandler = httpHandler<CatInterface>(async ({event}): Promise<CatInterface | never> => {
    const cat = await database().find(event?.pathParameters.id);

    if (!cat) {
        throw new NotFoundException();
    }

    return cat;
});
```

Results in a 404 with the payload
```JSON
{
    "message": "Not Found"
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

## Available options 

This is an example of all available options. All have default methods and values.

```typescript

export const getCatHandler = httpHandler<InputInterface, Array<string>>({
    handler: async ({event}): Promise<InputInterface | never> => { // your handler
        return Promise.resolve('hello!');
    },
    validator: (value: any): InputInterface => { // validation method
        if (!value.input) {
            throw new BadRequestException();
        }

        return value as InputInterface;
    },
    defaultStatus: HttpStatusCode.NO_CONTENT, // default status code
    defaultOutputHeaders: { // default return headers
        ['X-header']: `true`,
    },
    logger: (
        errorHandlingOptions: ErrorHandlingOptionsType,
        error: Error | HttpErrorException,
    ) => { // customise the logging output
        console.error(error);
    },
    loggingHandlingOptions: HttpStatusCode.NOT_FOUND_EXCEPTION, // only log 404 errors
    serialise: {
        input: (event: APIGatewayEvent): any => event.body.split(''), // customised input
        output: (output: Array<string>): string => output.join(''), //customised body output
    },
});
```

## Validator
The validator method is for validating the incoming structure and returned the `RequestType` or required payload type for your given handler.

```typescript
class CatDTO {
    constructor(
        readonly name: string,
        readonly breed: BreedEnum,
        readonly lives: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
    ) {}
}
export const myHandler = httpHandler<CatDTO>({
    handler: ({payload}) => {
        console.log(payload.name, payload.breed, payload.lives);
    },
    validator: (value: any): CatDTO => {
        const cat = new CatDTO(value);

        const validationErrors = {};

        if (!cat.name) {
            validationErrors.name = 'Name is required';
        }

        if (cat.lives > 9) {
            validationErrors.lives = 'A cat cannot have more than 9 lives';
        }

        if (validationErrors.length >= 1) {
            throw new BadRequestException('Validation Errors', validationErrors);
        }

        return cat;
    },
});
```

## Serialisation

By default, the http handler method will serialise the event body using JSON.parse. If you wish to serialise using a different method you can provide your custom method. The default for output is to convert the response from your handler to JSON.

#### Input
```typescript
export const myHandler = httpHandler({
    handler: ({body}) => {
        return body; // body is returned from input method
    },
    defaultStatusCode: HttpStatusCode.NO_CONTENT,
    serialise: {
        input: (event: APIGatewayEvent): any => JSON.parse(event.body),
    },
});
```
#### Output

```typescript
interface UserInterface =  {
    password: string;
    email: string;
};

export const myHandler = httpHandler<undefined, UserInterface>({
    handler: (): UserInterface => {
        return {
            email: 'iam@email.com',
            password: 'hello!Ishould-not-be-returned!',
        };
    },
    defaultStatusCode: HttpStatusCode.NO_CONTENT,
    serialise: {
        output: (result: UserInterface): string => {
            delete result.password;

            return JSON.stringify(result);
        },
    },
});
```

## Custom Error Handling

All exceptions thrown will be handled by the error handler which will convert the exception into a response object. You can override this function by providing a custom method. You could even filter out specific exceptions and return the default

```typescript
export const myHandler = httpHandler<any>({
    handler: ({payload}) => {
        if (!payload) {
            throw new BadRequestException();
        }

        if (!payload.id) {
            throw new UnprocessableEntityException();
        }
    },
    errorHandler: (error: HttpErrorResponseInterface | Error): APIGatewayProxyResult => {
        if (isHttpErrorException(error) && error instanceof BadRequestException) {
            return {
                statusCode: httpStatusCode.NO_CONTENT,
            };
        }

        return httpErrorHandler(error);
    },
});
```

## Default status code and headers

The below example will always output a status code of 204.

```typescript
export const myHandler = httpHandler({
    handler: () => {

    },
    defaultStatusCode: HttpStatusCode.NO_CONTENT,
});
```
#### default Headers 

The below example will always output a header `X-header`

```typescript
export const myHandler = httpHandler({
    handler: () => {

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