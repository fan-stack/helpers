# FAN-Stack Helpers

[![latest](https://img.shields.io/npm/v/%40fan-stack%2Fhelpers/latest.svg)](https://npmjs.com/package/@fan-stack/helpers)
[![Build Status](https://travis-ci.com/fan-stack/helpers.svg?branch=master)](https://travis-ci.com/fan-stack/helpers)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Dependency Status](https://david-dm.org/fan-stack/helpers.svg)](https://david-dm.org/fan-stack/helpers)
[![devDependency Status](https://david-dm.org/fan-stack/helpers/dev-status.svg)](https://david-dm.org/fan-stack/helpers?type=dev)

[![image.png](image.png)](https://github.com/pfa-stack/helpers)

# How to use it

## How to install

### Yarn

`yarn add @fan-stack/helpers`

### Npm

`npm i @fan-stack/helpers`

### Pnpm

`pnpm i @fan-stack/helpers`

## HTTPS Functions

### Single Function

Replace NestJS main.ts file with the following

```ts
import { nestToFirebaseFunction } from '@fan-stack/helpers';
import { AppModule } from './app.module';

export const api = nestToFirebaseFunction(AppModule);
```

If you run `firebase serve --only functions`(after building the project) you will see the function is up and running.

### Multiple functions

Having only one function for all the endpoints may not be the best approach for you, to solve that, the only thing you need to do is to export a new function using a different module. Because the AppModule is normally the one with everything, you would normally not use it when exporting multiple functions:

## Auth Functions

For auth trigger functions, you need to specify what trigger you want to use, either 'create' or 'delete', then the module, and the service and the method that should behave like the function.

```ts
import { nestToAuthFunction } from '@fan-stack/helpers';
import { AccountModule } from './app.module';
import { AccountService } from './app.service';

// onCreate
export const onCreateUser = nestToAuthFunction(
  'create',
  AccountModule,
  AccountService,
  'onCreateUser'
);

// onDelete
export const onDeleteUser = nestToAuthFunction(
  'delete',
  AccountModule,
  AccountService,
  'onDeleteUser'
);
```

# Firebase configuration

You will need to configure your project to work with Firebase before using this. Here is a simple way of doing it:

## Add firebase.json file

```json
{
  "functions": {
    "source": "."
  }
}
```

For this case, the source of the functions is in the root folder, if you have your NestJS project in a sub-folder, change the `source` property to the respective subfolder.

## Add a .firebaserc file

```json
{
  "projects": {}
}
```

## Add Firebase packages

You will need `firebase-functions`, `firebase-admin`, and `firebase-tools`.

### Dependencies

`yarn add firebase-functions firebase-admin`

### Dev Dependencies

`yarn add -D firebase-tools`

### Init your Firebase CLI

Login with the CLI if you haven't logged in already by running `yarn firebase login` then run

`yarn firebase use --add`

This will ask you to select your project and then ask for the alias name to use, normally you can use `default` as the alias, the project ID from the project you choose will be added to the `.firebaserc` file.

## Emulate Firebase Functions

If you plan to emulate the functions using the Firebase CLI, you may want to use the following trick:

`yarn config set ignore-engines true`

This will allow yarn to install the [Google Cloud Functions Emulator](https://github.com/GoogleCloudPlatform/cloud-functions-emulator) because that package supports only Node.js v6.11.5, the latest code already supports newer versions but it hasn't been released to NPM yet.

Now you will need to remove your `node_modules` folder and run `yarn` again to install the dependencies including the emulator.
