# FAN-Stack Helpers

[![latest](https://img.shields.io/npm/v/%40fan-stack%2Fhelpers/latest.svg)](https://npmjs.com/package/@fan-stack/helpers)
[![Build Status](https://travis-ci.com/fan-stack/helpers.svg?branch=master)](https://travis-ci.com/fan-stack/helpers)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Dependency Status](https://david-dm.org/fan-stack/helpers.svg)](https://david-dm.org/fan-stack/helpers)
[![devDependency Status](https://david-dm.org/fan-stack/helpers/dev-status.svg)](https://david-dm.org/fan-stack/helpers?type=dev)

# How to use it

Replace NestJS main.ts file with the following

```ts
import { https } from 'firebase-functions';
import { nestToFirebase } from '@fan-stack/helpers';
import { AppModule } from './app.module';

export const api = https.onRequest(nestToFirebase(AppModule));
```

If you run `firebase serve --only functions` you will see the function is up and running.

## Multiple functions

Having only one function for all the endpoints may not be the best approach for you, to solve that, the only thing you need to do is to export a new function using a different module. Because the AppModule is normally the one with everything, you would normally not use it when exporting multiple functions:

```ts
import { https } from 'firebase-functions';
import { nestToFirebase } from '@fan-stack/helpers';
import { AccountModule } from './account/account.module';
import { ReviewsModule } from './reviews/reviews.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

export const account = https.onRequest(nestToFirebase(AccountModule));
export const reviews = https.onRequest(nestToFirebase(ReviewsModule));
export const restaurants = https.onRequest(nestToFirebase(RestaurantsModule));
```

This would create 3 different function instances where you can set the timeout, memory and any other configuration for each function in case you need to.

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

## Add a firebaserc file

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

`yarn firebase use --add`

This will ask you to select your project and then ask for the alias name to use, normally you can use `default` as the alias
