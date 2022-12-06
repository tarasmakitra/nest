<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

Nest framework TypeScript starter repository.

## Installation

1. Install dependencies

```bash
$ yarn install
```

2. Copy `.env.example` to `.env` 
3. Update `HASH_SALT` and `JWT_SECRET` with random values.
4. Update database credentials in `.env`


## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Authentication

Passport library is used for authenticating a user. The `validate()` method for any Passport strategy will follow a
similar pattern, varying only in the details of how credentials are represented. If a user is found, and the credentials
are valid, the user is returned so Passport can complete its tasks (e.g., creating the user property on the Request
object), and the request handling pipeline can continue. If it's not found, we throw an exception and let our exceptions
layer handle it.

Typically, the only significant difference in the `validate()` method for each strategy is how you determine if a user
exists and is valid.

### Password Strategy

`PasswordGuard` decorator is responsible for applying `LocalStrategy` on specific route.

When authenticating a request, the strategy parses a username and password, which are submitted via an HTML form to the
web application. The strategy then calls the verify function with those credentials.

For the local-strategy, Passport expects a `validate()` function with the following signature:
`validate(username: string, password: string): any`. The verify function is responsible for determining the user to
which the username belongs, as well as verifying the password.

### JWT Strategy

In a JWT strategy we evaluate whether the userId carried in the decoded token matches a record in our user database, or
matches a list of revoked tokens.

`JwtGuard` is registered as a global guard in `AuthModule`. This guard is used across the whole application, for every
controller and every route handler that are not marked with `@Public` decorator.

`@Public` is a metadata decorator used to indicate that route is public and `JwtGuard` will not be applied and will not
validate JWT token.

The user entity is validated by the `validate()` method in `JwtStrategy`.
