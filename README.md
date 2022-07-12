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
