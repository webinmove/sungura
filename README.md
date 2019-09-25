# Sungura

[![CircleCI](https://circleci.com/gh/webinmove/sungura.svg?style=svg)](https://circleci.com/gh/webinmove/sungura)
[![npm version](https://img.shields.io/npm/v/sungura.svg)](https://www.npmjs.com/package/sungura)
[![Dependency Status](https://img.shields.io/david/webinmove/sungura.svg?style=flat-square)](https://david-dm.org/webinmove/sungura)

Node.js client to build workers with PUB/SUB pattern and rabbitMQ

TODO description

## Installation

```sh
$ npm install sungura
```

## Usage

### Import in your project
```js
// require sungura
const { sungura } = require('sungura');
// import sungura
import { sungura } from 'sungura';
```

### Create an instance

```js
const Messager = new Sungura({
  rabbitUrl: 'my.rabbit.url',
  exchange: 'my.topic',
  consumer: {
    scope: 'myscope',
    deadLettering: true
  }
});
```

TODO: some Explanation

## Npm scripts

### Running code formating

```sh
$ npm run format
```

### Running lint tests

```sh
$ npm test:lint
```

## Reporting bugs and contributing

If you want to report a bug or request a feature, please open an issue.
If want to help us improve sungura, fork and make a pull request.
Please use commit format as described [here](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).
And don't forget to run `npm run format` before pushing commit.

## Repository

- [https://github.com/webinmove/sungura](https://github.com/webinmove/sungura)

## License

The MIT License (MIT)

Copyright (c) 2019 WebInMove

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
