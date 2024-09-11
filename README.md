## Installation

```bash
$ npm install
```

Create .env file in the root directory of the project.

Add the environment variables.

```
# DATABASE CONFIGS
DATABASE_URI='mongodb://127.0.0.1:27017/'
DATABASE_NAME='task-management'
DATABASE_USER=
DATABASE_PASS=

# APP CONFIGS
PORT=3001
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Documentation

While application is running follow this [link](http://localhost:3001/api) to access documentation with Swagger.

## License

Nest is [MIT licensed](LICENSE).
