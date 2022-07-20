[![commit msg linted by git-commit-msg-linter](https://badgen.net/badge/git-commit-msg-linter/3.0.0/yellow)](https://www.npmjs.com/package/git-commit-msg-linter)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

# Node Typescript API

- [x] Clean Architecture (CA)
- [x] Domain Driven Design (DDD)
- [x] Test Driven Development (TDD)
- [x] Clean Code
- [x] S.O.L.I.D.
- [x] TypeScript

## Getting Started

Clone this repository:

```bash
git clone https;//github.com/EsattoDigital/node-typescript-api.git
```

After that, get into the project folder, and run the following command to install all dependencies:

> **(make sure to be inside the project folder before running any command)**

```bash
npm install
```

Note that at the root of the project folder, you will find a `.env.sample` file that contains all the environment variables that you need to set up the project. So go ahead and copy it to `.env` make the necessary changes.

**If you're only going to run tests over the features you're developing, you can stop here.**

With the environment variables set up, you can start the Docker container. If you don't have Docker installed, go to [Docker Download Page](https://docs.docker.com/engine/install/) and [Docker Compose Download Page](https://docs.docker.com/compose/install/) before continuing. If you're all set, run the following command:

```bash
docker-compose up --build
```

The `--build` flag will build the Docker images for you. You only need to use that flag the first time you run the command.

With all that setup, you should be able to run the following command to start the server:

```bash
npm run dev
```

## Testing

This project is built with [Jest](https://jestjs.io/). All tests are under `tests` folder. Tests with extension
`.spec.ts` are unit tests, tests with extension `.test.ts` are integration tests and tests with extension `.e2e.ts`
are end-to-end tests.

The project also uses other helpful tools for testing such as:

* [jest-extended](https://www.npmjs.com/package/jest-extended): Additional Jest matchers - https://github.com/jest-community/jest-extended
* [jest-mock-extended](https://www.npmjs.com/package/jest-mock-extended): Type safe mocking extensions for Jest - https://github.com/marchaos/jest-mock-extended
* [pg-mem](https://www.npmjs.com/package/pg-mem): An in memory postgres DB instance for your unit tests - https://github.com/oguimbal/pg-mem

The coverage policy of this project is to achieve 300% coverage of tests, meaning that all production code must be
covered 100% three times, one for unit tests, one for integration tests and one for end-to-end tests.

To run all tests, run the following command:

```bash
npm run test
```

To run tests in watch mode, run the following command:

```bash
npm run test:watch
```

To run tests related to staged changes, run the following command:

```bash
npm run test:staged
```

To run coverage, run the following command:

```bash
npm run test:coverage
```
